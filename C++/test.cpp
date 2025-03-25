#include <iostream>
#include <cstring>
#include <netinet/in.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <fstream>
#include <sstream>

void getInterfaceDetails(const std::string &iface) {
    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd == -1) {
        perror("Socket creation failed");
        return;
    }

    struct ifreq ifr;
    strncpy(ifr.ifr_name, iface.c_str(), IFNAMSIZ - 1);

    // Get IP Address
    if (ioctl(fd, SIOCGIFADDR, &ifr) == 0) {
        struct sockaddr_in *ip = (struct sockaddr_in *)&ifr.ifr_addr;
        std::cout << "IP Address: " << inet_ntoa(ip->sin_addr) << std::endl;
    } else {
        perror("Failed to get IP Address");
    }

    // Get Netmask
    if (ioctl(fd, SIOCGIFNETMASK, &ifr) == 0) {
        struct sockaddr_in *netmask = (struct sockaddr_in *)&ifr.ifr_netmask;
        std::cout << "Netmask: " << inet_ntoa(netmask->sin_addr) << std::endl;
    } else {
        perror("Failed to get Netmask");
    }

    // Get Broadcast Address
    if (ioctl(fd, SIOCGIFBRDADDR, &ifr) == 0) {
        struct sockaddr_in *bcast = (struct sockaddr_in *)&ifr.ifr_broadaddr;
        std::cout << "Broadcast IP: " << inet_ntoa(bcast->sin_addr) << std::endl;
    } else {
        perror("Failed to get Broadcast IP");
    }

    close(fd);
}

// Get Default Gateway from /proc/net/route
std::string getGateway(const std::string &iface) {
    std::ifstream file("/proc/net/route");
    if (!file.is_open()) {
        std::cerr << "Failed to open /proc/net/route" << std::endl;
        return "";
    }

    std::string line;
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string interfaceName, destination, gateway, flags;

        if (!(iss >> interfaceName >> destination >> gateway >> flags))
            continue;

        if (interfaceName == iface && destination == "00000000") { // Default route for the given interface
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

int main() {
    std::string interface = "enp0s8"; // Change to your interface name

    std::cout << "Interface: " << interface << std::endl;
    getInterfaceDetails(interface);

    std::string gateway = getGateway(interface);
    if (!gateway.empty()) {
        std::cout << "Gateway IP: " << gateway << std::endl;
    } else {
        std::cout << "Failed to retrieve Gateway IP" << std::endl;
    }

    return 0;
}
