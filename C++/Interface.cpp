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
    try
    {
        // Step 1: Delete the existing IP address
        std::string deleteCommand = "sudo ip addr flush dev " + interface;
        if (system(deleteCommand.c_str()) != 0)
        {
            std::cerr << "Failed to remove old IP address from " << interface << std::endl;
            return;
        }

        // Step 2: Assign the new IP address
        std::string addCommand = "sudo ip addr add " + newIP + "/" + std::to_string(netmask) + " dev " + interface;
        if (system(addCommand.c_str()) != 0)
        {
            std::cerr << "Failed to assign new IP address to " << interface << std::endl;
            return;
        }

        // Step 3: Bring the interface up (optional)
        std::string upCommand = "sudo ip link set " + interface + " up";
        if (system(upCommand.c_str()) != 0)
        {
            std::cerr << "Failed to bring interface " << interface << " up" << std::endl;
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "Exception in changeIPAddress: " << e.what() << std::endl;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in changeIPAddress." << std::endl;
    }
}

void Interface::changeLANInterface(std::string &interface)
{
    try
    {
        std::ofstream file("/tmp/LAN");
        if (file)
        {
            file << interface;
            file.close();
        }
        else
        {
            std::cerr << "Failed to open /tmp/LAN for writing." << std::endl;
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "Exception in changeLANInterface: " << e.what() << std::endl;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in changeLANInterface." << std::endl;
    }
}

void Interface::changeWANInterface(std::string &interface)
{
    try
    {
        std::ofstream file("/tmp/WAN");
        if (file)
        {
            file << interface;
            file.close();
        }
        else
        {
            std::cerr << "Failed to open /tmp/WAN for writing." << std::endl;
        }

        if (interface.length() == 0)
        {
            return;
        }

        Firewall::allowMasquerading(interface);
    }
    catch (const std::exception &e)
    {
        std::cerr << "Exception in changeWANInterface: " << e.what() << std::endl;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in changeWANInterface." << std::endl;
    }
}


void Interface::changeInterfaceConfiguration(const char *data, int length, int fd)
{
    try
    {
        if (length < 8)
        {
            std::cerr << "Bad packet: insufficient meta data\n";
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
        result.ip = ntohl(ipBigEndian);
        offset += sizeof(uint32_t);

        // Extract interface name length (1 byte)
        uint8_t nameLength = static_cast<uint8_t>(data[offset++]);

        // Ensure valid data length
        if (length < 8 + nameLength)
        {
            std::cerr << "Bad packet: insufficient data\n";
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
        send(fd, &ack, 1, 0);
    }
    catch (const std::exception &e)
    {
        std::cerr << "Interface Error in C++: " << e.what() << "\n";
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in changeInterfaceConfiguration.\n";
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
        // std::cerr << "Failed to read variable." << std::endl;
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
        // std::cerr << "Failed to read variable." << std::endl;
    }
    return value;
}

std::string Interface::getInterfaceListJSON()
{
    try
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

        // First Loop: Process only interfaces that have an IPv4 address
        for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next)
        {
            if (ifa->ifa_addr == nullptr)
                continue;

            if (ifa->ifa_addr->sa_family != AF_INET)
                continue;

            std::string interface = ifa->ifa_name;
            if (interface == "lo")
                continue;

            char ip[INET_ADDRSTRLEN];
            char netmask[INET_ADDRSTRLEN];

            struct sockaddr_in *addr = (struct sockaddr_in *)ifa->ifa_addr;
            struct sockaddr_in *mask = (struct sockaddr_in *)ifa->ifa_netmask;

            inet_ntop(AF_INET, &addr->sin_addr, ip, INET_ADDRSTRLEN);
            inet_ntop(AF_INET, &mask->sin_addr, netmask, INET_ADDRSTRLEN);

            int type = (interface == lanInterface) ? 0 : (interface == wanInterface) ? 1 : -1;

            data.push_back({{"if", interface},
                            {"ip", ip},
                            {"netmask", netmask},
                            {"type", type}});

            processedInterfaces.insert(interface);
        }

        // Second Loop: Process remaining interfaces without an IPv4 address
        for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next)
        {
            if (ifa->ifa_addr == nullptr)
                continue;

            std::string interface = ifa->ifa_name;
            if (interface == "lo")
                continue;

            if (processedInterfaces.find(interface) != processedInterfaces.end())
                continue;

            int type = (interface == lanInterface) ? 0 : (interface == wanInterface) ? 1 : -1;

            data.push_back({{"if", interface},
                            {"ip", ""},
                            {"netmask", ""},
                            {"type", type}});

            processedInterfaces.insert(interface);
        }

        freeifaddrs(ifaddr);
        return data.dump();
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error in getInterfaceListJSON: " << e.what() << std::endl;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in getInterfaceListJSON." << std::endl;
    }

    return "";
}


std::string Interface::getGateway(const std::string &iface)
{
    try
    {
        std::ifstream file("/proc/net/route");
        if (!file.is_open())
        {
            // std::cerr << "Failed to open /proc/net/route" << std::endl;
            return "";
        }

        std::string line;
        while (std::getline(file, line))
        {
            std::istringstream iss(line);
            std::string interfaceName, destination, gateway, flags;

            if (!(iss >> interfaceName >> destination >> gateway >> flags))
                continue;

            if (interfaceName == iface && destination == "00000000")
            { // Default route for the given interface
                unsigned int gwHex;
                std::stringstream ss;
                ss << std::hex << gateway;
                ss >> gwHex;

                struct in_addr gwAddr;
                gwAddr.s_addr = gwHex;
                return inet_ntoa(gwAddr);
            }
        }

        return "";
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error in getGateway: " << e.what() << std::endl;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in getGateway." << std::endl;
    }

    return "";
}


std::string Interface::getLANInterfaceDetails()
{
    try
    {
        std::string iface = getLANInterface();
        std::string IP = "";
        std::string nm = "";
        std::string bip = "";
        std::string gip = "";

        int fd = socket(AF_INET, SOCK_DGRAM, 0);
        if (fd == -1)
        {
            perror("Socket creation failed");
            json data = {
                {"IP", IP},
                {"nm", nm},
                {"bip", bip},
                {"gip", gip}};
            return data.dump();
        }

        struct ifreq ifr;
        strncpy(ifr.ifr_name, iface.c_str(), IFNAMSIZ - 1);
        ifr.ifr_name[IFNAMSIZ - 1] = '\0';

        // Get IP Address
        if (ioctl(fd, SIOCGIFADDR, &ifr) == 0)
        {
            struct sockaddr_in *ip = (struct sockaddr_in *)&ifr.ifr_addr;
            IP = inet_ntoa(ip->sin_addr);
        }
        else
        {
            perror("Failed to get IP Address");
        }

        // Get Netmask
        if (ioctl(fd, SIOCGIFNETMASK, &ifr) == 0)
        {
            struct sockaddr_in *netmask = (struct sockaddr_in *)&ifr.ifr_netmask;
            nm = inet_ntoa(netmask->sin_addr);
        }
        else
        {
            perror("Failed to get Netmask");
        }

        // Get Broadcast Address
        if (ioctl(fd, SIOCGIFBRDADDR, &ifr) == 0)
        {
            struct sockaddr_in *bcast = (struct sockaddr_in *)&ifr.ifr_broadaddr;
            bip = inet_ntoa(bcast->sin_addr);
        }
        else
        {
            perror("Failed to get Broadcast IP");
        }

        close(fd);

        gip = getGateway(iface);

        json data = {
            {"if", iface},
            {"ip", IP},
            {"nm", nm},
            {"bip", bip},
            {"gip", gip}};
        return data.dump();
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error in getLANInterfaceDetails: " << e.what() << std::endl;
    }
    catch (...)
    {
        std::cerr << "Unknown error occurred in getLANInterfaceDetails." << std::endl;
    }

    // In case of error, return empty data
    json data = {
        {"if", ""},
        {"ip", ""},
        {"nm", ""},
        {"bip", ""},
        {"gip", ""}};
    return data.dump();
}
