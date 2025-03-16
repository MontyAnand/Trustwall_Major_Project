#include <iostream>
#include <cstring>
#include <cstdlib>
#include <cstdio>
#include <map>
#include <set>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <ifaddrs.h>
#include <string.h>

std::set<std::string> ipv4Interfaces;
std::set<std::string> otherInterfaces;
std::map<std::string, std::string> ipMap;
std::map<std::string, bool> statusMap;

void getInterfaceDetails()
{
    struct ifaddrs *ifaddr, *ifa;
    char ip[INET6_ADDRSTRLEN];

    if (getifaddrs(&ifaddr) == -1)
    {
        perror("getifaddrs");
        return;
    }

    std::cout << "=========================================" << std::endl;
    std::cout << " Network Interfaces Information " << std::endl;
    std::cout << "=========================================" << std::endl;

    for (ifa = ifaddr; ifa != NULL; ifa = ifa->ifa_next)
    {
        if (ifa->ifa_addr == NULL)
            continue; // Skip NULL addresses

        if (strcmp(ifa->ifa_name, "lo") == 0)
            continue;

        // Get Interface Status (UP/DOWN)
        if (ifa->ifa_flags & IFF_UP)
        {
            statusMap[ifa->ifa_name] = true;
        }
        else
        {
            statusMap[ifa->ifa_name] = false;
        }

        // Get IPv4 Address
        if (ifa->ifa_addr->sa_family == AF_INET)
        {
            ipv4Interfaces.insert(ifa->ifa_name);
            if (otherInterfaces.find(ifa->ifa_name) != otherInterfaces.end())
            {
                otherInterfaces.erase(ifa->ifa_name);
            }
            struct sockaddr_in *ipv4 = (struct sockaddr_in *)ifa->ifa_addr;
            inet_ntop(AF_INET, &ipv4->sin_addr, ip, sizeof(ip));
            ipMap[ifa->ifa_name] = ip;
        }

        // Get IPv6 Address
        else if (ifa->ifa_addr->sa_family == AF_INET6)
        {
            if (ipv4Interfaces.find(ifa->ifa_name) != ipv4Interfaces.end())
            {
                continue;
            }
            otherInterfaces.insert(ifa->ifa_name);
            struct sockaddr_in6 *ipv6 = (struct sockaddr_in6 *)ifa->ifa_addr;
            inet_ntop(AF_INET6, &ipv6->sin6_addr, ip, sizeof(ip));
        }

        // If interface has no IPv4 or IPv6
        if (!(ifa->ifa_addr->sa_family == AF_INET || ifa->ifa_addr->sa_family == AF_INET6))
        {
            if (ipv4Interfaces.find(ifa->ifa_name) != ipv4Interfaces.end())
            {
                continue;
            }
            otherInterfaces.insert(ifa->ifa_name);
        }
    }
    freeifaddrs(ifaddr);
}

int main()
{
    getInterfaceDetails();
    for(auto &x: ipv4Interfaces){
        std::cout << x << " " << (statusMap[x] ? "UP":"DOWN") << " " << ipMap[x] << std::endl;
    }
    for(auto &x: otherInterfaces){
        std::cout << x << " " << (statusMap[x] ? "UP":"DOWN") << "\n"; 
    }
    return 0;
}
