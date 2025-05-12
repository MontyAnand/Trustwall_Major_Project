#include "headers.h"

struct InterfaceData
{
    uint8_t flag;
    uint8_t type;
    uint8_t netmask;
    uint32_t ip;
    uint32_t gip;
    std::string interfaceName;
};

void Interface::changeIPAddress(const std::string &interface, const std::string &newIP, int netmask, std::string &gatewayIP)
{
    // Step 1: Delete the existing IP address
    std::string deleteCommand = "sudo ip addr flush dev " + interface;
    // std::cout << "Executing: " << deleteCommand << std::endl;
    if (system(deleteCommand.c_str()) != 0)
    {
        std::cerr << "Failed to remove old IP address from " << interface << std::endl;
        return;
    }

    // Step 2: Assign the new IP address
    std::string addCommand = "sudo ip addr add " + newIP + "/" + std::to_string(netmask) + " dev " + interface;
    // std::cout << "Executing: " << addCommand << std::endl;
    if (system(addCommand.c_str()) != 0)
    {
        std::cerr << "Failed to assign new IP address to " << interface << std::endl;
        return;
    }

    // Step 3: Bring the interface up (optional)
    std::string upCommand = "sudo ip link set " + interface + " up";
    // std::cout << "Executing: " << upCommand << std::endl;
    if (system(upCommand.c_str()) != 0)
    {
        std::cerr << "Failed to bring interface " << interface << " up" << std::endl;
    }

    std::string addGatewayCommand = "sudo ip route add " + newIP+"/"+ std::to_string(netmask)+" via " + gatewayIP + " dev " + interface;
    if (system(addGatewayCommand.c_str()) != 0)
    {
        std::cerr << "Failed to assign gateway IP " << interface << " " << gatewayIP << std::endl;
    }

    // std::cout << "IP address successfully updated on " << interface << std::endl;
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
    if (interface.length() == 0)
    {
        return;
    }
    Firewall::allowMasquerading(interface);
    return;
}

void Interface::changeInterfaceConfiguration(const char *data, int length, int fd)
{
    try
    {
        if (length < 12)
        {
            // std::cout << "Bad packet : insufficient meta data\n";
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

        // Extract Gateway IP (4 bytes) - Big Endian to Host Order
        std::memcpy(&ipBigEndian, &data[offset], sizeof(uint32_t));
        result.gip = ntohl(ipBigEndian); // Convert to host order
        offset += sizeof(uint32_t);

        // Extract interface name length (1 byte)
        uint8_t nameLength = static_cast<uint8_t>(data[offset++]);

        // Ensure valid data length
        if (length < 8 + nameLength)
        {
            // std::cout << "Bad packet : insufficient data\n";
            return;
        }

        // Extract interface name
        result.interfaceName = std::string(data + offset, nameLength);

        // Convert IP to string format
        std::string ip = std::to_string((result.ip >> 24) & 0xFF) + "." +
                         std::to_string((result.ip >> 16) & 0xFF) + "." +
                         std::to_string((result.ip >> 8) & 0xFF) + "." +
                         std::to_string(result.ip & 0xFF);

        // Convert GIP to string format
        std::string gip = std::to_string((result.gip >> 24) & 0xFF) + "." +
                          std::to_string((result.gip >> 16) & 0xFF) + "." +
                          std::to_string((result.gip >> 8) & 0xFF) + "." +
                          std::to_string(result.gip & 0xFF);
        std::cout << gip << "\n";
        changeIPAddress(result.interfaceName, ip, result.netmask, gip);

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
        // std::cout << "Interface Error in C++ : " << e.what() << "\n";
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

void Interface::initLANInterface()
{
    std::string wanInterface = getWANInterface();
    struct ifaddrs *ifaddr, *ifa;

    if (getifaddrs(&ifaddr) == -1)
    {
        perror("getifaddrs");
        return ;
    }
    for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next)
    {
        if (ifa->ifa_addr == nullptr)
            continue;

        std::string interface = ifa->ifa_name;
        if (interface == "lo") // Skip loopback
            continue;
        if(interface == wanInterface){
            continue;
        }
        changeLANInterface(interface);
        std::string newIP = "172.16.0.1";
        std::string gatewayIP = "172.16.0.1";
        changeIPAddress(interface,newIP,24,gatewayIP);
        return;
    }
    freeifaddrs(ifaddr); // Free allocated memory
}

std::string Interface::getGateway(const std::string &iface)
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

std::string Interface::getLANInterfaceDetails()
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

    // Get IP Address
    if (ioctl(fd, SIOCGIFADDR, &ifr) == 0)
    {
        struct sockaddr_in *ip = (struct sockaddr_in *)&ifr.ifr_addr;
        // std::cout << "IP Address: " << inet_ntoa(ip->sin_addr) << std::endl;
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
        // std::cout << "Netmask: " << inet_ntoa(netmask->sin_addr) << std::endl;
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
        // std::cout << "Broadcast IP: " << inet_ntoa(bcast->sin_addr) << std::endl;
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