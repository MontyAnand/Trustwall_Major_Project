#include <iostream>
#include <cstring>
#include <cstdlib>
#include <cstdio>
#include <map>
#include <set>
#include <vector>
#include <fstream>
#include <sstream>
#include <sys/ioctl.h>
#include <net/if.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <ifaddrs.h>
#include <string.h>

#define CONFIG_FILE "/etc/default/isc-dhcp-server"

struct InterfaceInfo
{
    std::string iname;
    bool isUP;
    bool isIPAddressAssigned;
    std::string IP;
};

class InterfaceConfiguration
{
private:
    std::vector<InterfaceInfo> wanCandidates;
    std::vector<InterfaceInfo> lanCandidates;
    void init();
    void collectInterfaceInfo();
    void setEnvVariable(std::string, std::string);
    void configureDefaultDHCPServer();
    void setWanInterface();
    void setLanInterface();
    void changeDHCPInterface(std::string);

public:
    InterfaceConfiguration();
    void getInterfaceInfo();
    std::string getEnvVariable(std::string);
};

int main()
{
    InterfaceConfiguration ic;
    ic.getInterfaceInfo();
    std::cout << ic.getEnvVariable("LAN") << "\n";
    std::cout << ic.getEnvVariable("WAN") << "\n";
    return 0;
}


void InterfaceConfiguration::changeDHCPInterface(std::string new_interface){
    std::ifstream inFile(CONFIG_FILE);
    std::ostringstream buffer;
    std::string line;
    bool found = false;

    if (!inFile) {
        std::cerr << "Error opening file: " << CONFIG_FILE << std::endl;
        return;
    }

    // Read the file and modify INTERFACESv4
    while (getline(inFile, line)) {
        if (line.find("INTERFACESv4=") != std::string::npos) {
            buffer << "INTERFACESv4=\"" << new_interface << "\"" << std::endl;
            found = true;
        } else {
            buffer << line << std::endl;
        }
    }
    inFile.close();

    // If INTERFACESv4 was not found, add it
    if (!found) {
        buffer << "INTERFACESv4=\"" << new_interface << "\"" << std::endl;
    }

    // Write the changes back to the file
    std::ofstream outFile(CONFIG_FILE);
    if (!outFile) {
        std::cerr << "Error writing to file: " << CONFIG_FILE << std::endl;
        return;
    }
    outFile << buffer.str();
    outFile.close();

    std::cout << "DHCP Interface updated to: " << new_interface << std::endl;
}

void InterfaceConfiguration::configureDefaultDHCPServer(){
    std::string lanInterface = getEnvVariable("LAN");
    if(lanInterface.empty()){
        std::cout << "No available Interface for LAN DHCP Configuration\n";
        return;
    }
    std::string command = "sudo ip addr add 172.16.0.1/12 dev "+lanInterface;
    int result = system(command.c_str());
    command = "sudo ip link set "+ lanInterface + " up";
    result = system(command.c_str());
    changeDHCPInterface(lanInterface);
    system("sudo systemctl restart isc-dhcp-server");
    return;
}


void InterfaceConfiguration::init()
{
    std::ofstream file;

    // Write to /tmp/LAN
    file.open("/tmp/LAN");
    if (file) {
        file << "none";
        file.close();
    }

    // Write to /tmp/WAN
    file.open("/tmp/WAN");
    if (file) {
        file << "none";
        file.close();
    }
    return; 
}

void InterfaceConfiguration::setWanInterface()
{
    if (wanCandidates.empty())
    {
        std::cout << "No suitable WAN Interface Detected\n";
        return;
    }
    // Activation of WAN Interface if not already
    if (!wanCandidates[0].isUP)
    {
    }
    setEnvVariable("WAN", wanCandidates[0].iname);
    return;
}

void InterfaceConfiguration::setLanInterface()
{
    if (lanCandidates.empty())
    {
        std::cout << "No suitable LAN Interface detected !!!\n";
        return;
    }
    // Up the interface if not already
    if (!lanCandidates[0].isUP)
    {
    }
    setEnvVariable("LAN", lanCandidates[0].iname);
}

std::string InterfaceConfiguration::getEnvVariable(std::string key)
{
    std::ifstream file(("/tmp/" + key).c_str());
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

void InterfaceConfiguration::setEnvVariable(std::string key, std::string value)
{
    std::ofstream file(("/tmp/" + key).c_str());
    if (file)
    {
        file << value;
        file.close();
    }
}

void InterfaceConfiguration::collectInterfaceInfo()
{
    std::set<std::string> ipv4Interfaces;
    std::set<std::string> otherInterfaces;
    std::map<std::string, std::string> ipMap;
    std::map<std::string, bool> statusMap;

    struct ifaddrs *ifaddr, *ifa;
    char ip[INET6_ADDRSTRLEN];
    if (getifaddrs(&ifaddr) == -1)
    {
        perror("getifaddrs");
        return;
    }
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
    for (auto &x : ipv4Interfaces)
    {
        InterfaceInfo iif;
        iif.iname = x;
        iif.isUP = statusMap[x];
        iif.isIPAddressAssigned = true;
        iif.IP = ipMap[x];
        wanCandidates.push_back(iif);
    }

    for (auto &x : otherInterfaces)
    {
        InterfaceInfo iif;
        iif.iname = x;
        iif.isUP = statusMap[x];
        iif.isIPAddressAssigned = false;
        iif.IP = "";
        lanCandidates.push_back(iif);
    }
}

void InterfaceConfiguration::getInterfaceInfo()
{
    for (auto &x : wanCandidates)
    {
        std::cout << x.iname << " " << (x.isUP ? "UP" : "DOWN") << " " << x.IP << "\n";
    }
    for (auto &x : lanCandidates)
    {
        std::cout << x.iname << " " << (x.isUP ? "UP" : "DOWN") << " " << x.IP << "\n";
    }
}

InterfaceConfiguration::InterfaceConfiguration()
{
    init();
    collectInterfaceInfo();
    setWanInterface();
    setLanInterface();
    configureDefaultDHCPServer();
}