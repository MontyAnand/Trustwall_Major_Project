#include "headers.h"

std::string Interface::getLANInterface()
{
    std::ifstream file(("/tmp/LAN"));
    std::string value;

    if (file)
    {
        std::getline(file, value);
    }
    else
    {
        std::cerr << "Failed to read variable." << std::endl;
    }
    return value;
}
std::string Interface::getWANInterface()
{
    std::ifstream file(("/tmp/WAN"));
    std::string value;

    if (file)
    {
        std::getline(file, value);
    }
    else
    {
        std::cerr << "Failed to read variable." << std::endl;
    }
    return value;
}

std::string Interface::getInterfaceListJSON()
{
    json data = json::array();
    std::string lanInterface = getLANInterface();
    std::string wanInterface = getWANInterface();

    std::set<std::string> processedInterfaces;
    struct ifaddrs *ifaddr, *ifa;

    if (getifaddrs(&ifaddr) == -1)
    {
        perror("getifaddrs");
        return "";
    }

    // **First Loop: Process only interfaces that have an IPv4 address**
    for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next)
    {
        if (ifa->ifa_addr == nullptr)
            continue;

        if (ifa->ifa_addr->sa_family != AF_INET) // Process only IPv4 interfaces
            continue;

        std::string interface = ifa->ifa_name;
        if (interface == "lo") // Skip loopback
            continue;

        char ip[INET_ADDRSTRLEN];
        char netmask[INET_ADDRSTRLEN];

        struct sockaddr_in *addr = (struct sockaddr_in *)ifa->ifa_addr;
        struct sockaddr_in *mask = (struct sockaddr_in *)ifa->ifa_netmask;

        inet_ntop(AF_INET, &addr->sin_addr, ip, INET_ADDRSTRLEN);
        inet_ntop(AF_INET, &mask->sin_addr, netmask, INET_ADDRSTRLEN);

        int type = (interface == lanInterface) ? 0 : (interface == wanInterface) ? 1
                                                                                 : -1;

        data.push_back({{"if", interface},
                        {"ip", ip},
                        {"netmask", netmask},
                        {"type", type}});

        processedInterfaces.insert(interface); // Mark as processed
    }

    // **Second Loop: Process remaining interfaces without an IPv4 address**
    for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next)
    {
        if (ifa->ifa_addr == nullptr)
            continue;

        std::string interface = ifa->ifa_name;
        if (interface == "lo") // Skip loopback
            continue;

        if (processedInterfaces.find(interface) != processedInterfaces.end())
            continue; // Already processed in the first loop
        processedInterfaces.insert(interface);

        int type = (interface == lanInterface) ? 0 : (interface == wanInterface) ? 1: -1;

        data.push_back({{"if", interface},
                        {"ip", ""},
                        {"netmask", ""},
                        {"type", type}});

        processedInterfaces.insert(interface);
    }

    freeifaddrs(ifaddr); // Free allocated memory
    return data.dump(); // Pretty-print JSON output
}