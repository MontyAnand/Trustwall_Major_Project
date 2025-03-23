#include "headers.h"

struct InterfaceData
{
    uint8_t flag;
    uint8_t type;
    uint8_t netmask;
    uint32_t ip;
    std::string interfaceName;
};

void Interface::changeIPAddress(const std::string &interface, const std::string &newIP, int netmask)
{
    // Step 1: Delete the existing IP address
    std::string deleteCommand = "sudo ip addr flush dev " + interface;
    std::cout << "Executing: " << deleteCommand << std::endl;
    if (system(deleteCommand.c_str()) != 0)
    {
        std::cerr << "Failed to remove old IP address from " << interface << std::endl;
        return;
    }

    // Step 2: Assign the new IP address
    std::string addCommand = "sudo ip addr add " + newIP + "/" + std::to_string(netmask) + " dev " + interface;
    std::cout << "Executing: " << addCommand << std::endl;
    if (system(addCommand.c_str()) != 0)
    {
        std::cerr << "Failed to assign new IP address to " << interface << std::endl;
        return;
    }

    // Step 3: Bring the interface up (optional)
    std::string upCommand = "sudo ip link set " + interface + " up";
    std::cout << "Executing: " << upCommand << std::endl;
    if (system(upCommand.c_str()) != 0)
    {
        std::cerr << "Failed to bring interface " << interface << " up" << std::endl;
    }

    std::cout << "IP address successfully updated on " << interface << std::endl;
}

void Interface::changeLANInterface(std::string &interface)
{
    std::ofstream file("/tmp/LAN");
    if (file)
    {
        file << interface;
        file.close();
    }
}
void Interface::changeWANInterface(std::string &interface)
{
    std::ofstream file("/tmp/WAN");
    if (file)
    {
        file << interface;
        file.close();
    }
}

void Interface::changeInterfaceConfiguration(const char *data, int length, int fd)
{
    try
    {
        if (length < 8)
        {
            std::cout << "Bad packet : insufficient meta data\n";
            return;
        }

        InterfaceData result;
        size_t offset = 0;

        // Extract flag (1 byte)
        result.flag = static_cast<uint8_t>(data[offset++]);

        // Extract interface type (1 byte)
        result.type = static_cast<uint8_t>(data[offset++]);

        // Extract netmask (1 byte)
        result.netmask = static_cast<uint8_t>(data[offset++]);

        // Extract IP (4 bytes) - Big Endian to Host Order
        uint32_t ipBigEndian;
        std::memcpy(&ipBigEndian, &data[offset], sizeof(uint32_t));
        result.ip = ntohl(ipBigEndian); // Convert to host order
        offset += sizeof(uint32_t);

        // Extract interface name length (1 byte)
        uint8_t nameLength = static_cast<uint8_t>(data[offset++]);

        // Ensure valid data length
        if (length < 8 + nameLength)
        {
            std::cout << "Bad packet : insufficient data\n";
            return;
        }

        // Extract interface name
        result.interfaceName = std::string(data + offset, nameLength);

        // Convert IP to string format
        std::string ip = std::to_string((result.ip >> 24) & 0xFF) + "." +
                         std::to_string((result.ip >> 16) & 0xFF) + "." +
                         std::to_string((result.ip >> 8) & 0xFF) + "." +
                         std::to_string(result.ip & 0xFF);

        changeIPAddress(result.interfaceName, ip, result.netmask);

        // Change interface type accordingly
        if (result.type == 0)
            changeLANInterface(result.interfaceName);
        else
            changeWANInterface(result.interfaceName);

        uint8_t ack = 21;
        send(fd,&ack,1,0);
    }
    catch (const std::exception &e)
    {
        std::cout << "Interface Error in C++ : " << e.what() << "\n";
    }
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

        int type = (interface == lanInterface) ? 0 : (interface == wanInterface) ? 1
                                                                                 : -1;

        data.push_back({{"if", interface},
                        {"ip", ""},
                        {"netmask", ""},
                        {"type", type}});

        processedInterfaces.insert(interface);
    }

    freeifaddrs(ifaddr); // Free allocated memory
    return data.dump();  // Pretty-print JSON output
}