#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <stdlib.h>
#include <string>
#include <iostream>
#include <netinet/in.h>  
#include <arpa/inet.h>  

#include <iostream>
#include <string>
#include <cstring>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#include <iostream>
#include <string>
#include <vector>
#include <cstring>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>

std::vector<std::string> getInterfaceDetails(const std::string &iface) {
    std::string ipAddr = "";
    std::string netmask = "";
    std::string broadcast = "";

    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd < 0) {
        perror("Socket error");
        return {ipAddr, netmask, broadcast};
    }

    struct ifreq ifr;
    memset(&ifr, 0, sizeof(ifr));
    strncpy(ifr.ifr_name, iface.c_str(), IFNAMSIZ - 1);

    // IP address
    if (ioctl(fd, SIOCGIFADDR, &ifr) == 0) {
        struct sockaddr_in *ip = reinterpret_cast<struct sockaddr_in *>(&ifr.ifr_addr);
        ipAddr = inet_ntoa(ip->sin_addr);
    }

    // Netmask
    if (ioctl(fd, SIOCGIFNETMASK, &ifr) == 0) {
        struct sockaddr_in *nm = reinterpret_cast<struct sockaddr_in *>(&ifr.ifr_netmask);
        netmask = inet_ntoa(nm->sin_addr);
    }

    // Broadcast address
    if (ioctl(fd, SIOCGIFBRDADDR, &ifr) == 0) {
        struct sockaddr_in *brd = reinterpret_cast<struct sockaddr_in *>(&ifr.ifr_broadaddr);
        broadcast = inet_ntoa(brd->sin_addr);
    }

    close(fd);
    return {ipAddr, netmask, broadcast};
}


int main(){
    FILE *fp;
    char path[1035];

    // Command to list interface names
    const char *cmd = "awk -F: '/:/ {print $1}' /proc/net/dev | sed 's/^[ \t]*//'";

    // Open the command for reading.
    fp = popen(cmd, "r");
    if (fp == NULL) {
        perror("popen failed");
        return 1;
    }

    // Read the output line by line and print
    printf("Network Interfaces:\n");
    while (fgets(path, sizeof(path), fp) != NULL) {
        std::string interface = path;
        interface.erase(interface.find_last_not_of("\n\r") + 1);
        if(interface == "lo")continue;
        std::cout << interface << "\n";
        std::vector<std::string> p = getInterfaceDetails (interface);
        std::cout << p[0] << " " << p[1] << " " << p[2] << std::endl; 
    }

    // Close
    pclose(fp);
    return 0;
}