// #include <iostream>
// #include <ifaddrs.h>
// #include <arpa/inet.h>
// #include <netinet/in.h>
// #include <cstring>

// int main() {
//     struct ifaddrs *ifaddr, *ifa;
//     char ip[INET_ADDRSTRLEN];
//     char netmask[INET_ADDRSTRLEN];

//     // Retrieve the list of network interfaces
//     if (getifaddrs(&ifaddr) == -1) {
//         perror("getifaddrs");
//         return 1;
//     }

//     // Loop through the linked list
//     for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next) {
//         if (ifa->ifa_addr == nullptr) continue;

//         // Check for IPv4 address
//         if (ifa->ifa_addr->sa_family == AF_INET) {
//             struct sockaddr_in *addr = (struct sockaddr_in *)ifa->ifa_addr;
//             struct sockaddr_in *mask = (struct sockaddr_in *)ifa->ifa_netmask;

//             // Convert address to string
//             inet_ntop(AF_INET, &addr->sin_addr, ip, INET_ADDRSTRLEN);
//             inet_ntop(AF_INET, &mask->sin_addr, netmask, INET_ADDRSTRLEN);

//             std::cout << "Interface: " << ifa->ifa_name << std::endl;
//             std::cout << "  IPv4 Address: " << ip << std::endl;
//             std::cout << "  Netmask: " << netmask << std::endl;
//         }
//     }

//     // Free memory
//     freeifaddrs(ifaddr);
//     return 0;
// }


#include "headers.h"

int main (){
    std::cout << Interface::getInterfaceListJSON() << std::endl;
    return 0;
}