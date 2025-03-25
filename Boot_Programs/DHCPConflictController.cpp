#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <vector>
#include <sstream>
#include <set>
#include <thread>
#include <chrono>

using namespace std;

struct IP_MAC
{
    std::string ip;
    std::string mac;

    bool operator<(const IP_MAC &other) const
    {
        return ip < other.ip || (ip == other.ip && mac < other.mac);
    }
};

class DHCPConflictController
{
private:
    const string path = "/var/lib/dhcp/dhcpd.leases";
    const string TABLE = "DHCP_TABLE";
    const string PAIR_SET = "allowed_pairs";
    const string CHAIN = "input_chain";
    const string INTERFACE = "enp0s8";

    set<IP_MAC> parsedPair;
    vector<IP_MAC> getNewPairs();

    void addPairToFirewall(IP_MAC);
    int init();
    void loop();

public:
    DHCPConflictController();
};

int main()
{
    DHCPConflictController d;
    return 0;
}

vector<IP_MAC> DHCPConflictController::getNewPairs()
{
    vector<IP_MAC> ipMacList;
    string command = "awk '/lease/ {ip=$2} /hardware ethernet/ {print ip, $3}' " + path;
    FILE *pipe = popen(command.c_str(), "r");
    if (!pipe)
    {
        std::cerr << "Error opening pipe!" << std::endl;
        return ipMacList;
    }

    char buffer[128];
    while (fgets(buffer, sizeof(buffer), pipe) != nullptr)
    {
        std::istringstream iss(buffer);
        IP_MAC entry;
        if (iss >> entry.ip >> entry.mac)
        {
            entry.mac = entry.mac.substr(0, entry.mac.length() - 1);
            if (parsedPair.find(entry) == parsedPair.end())
            {
                ipMacList.push_back(entry);
                parsedPair.insert(entry);
            }
        }
    }
    pclose(pipe);
    return ipMacList;
}

int DHCPConflictController::init()
{
    string command;
    // Creating Table
    command = "sudo nft add table inet " + TABLE;
    if (system(command.c_str()) != 0)
    {
        return 0;
    }
    // Creating a Set of {IP and MAC address}

    command = "sudo nft add set inet " + TABLE + " " + PAIR_SET + " '{ type ipv4_addr . ether_addr; flags interval; }'";
    if (system(command.c_str()) != 0)
    {
        return 0;
    }
    // Creating a Chain
    
    command = "sudo nft add chain inet " + TABLE + " " + CHAIN + " '{ type filter hook input priority 0; }'";
    if (system(command.c_str()) != 0)
    {
        return 0;
    }
    // Adding rule to the chain
    
    command = "sudo nft add rule inet " + TABLE + " " + CHAIN + " iifname " + INTERFACE + " ip saddr . ether saddr != @" + PAIR_SET + " drop ";
    if (system(command.c_str()) != 0)
    {
        return 0;
    }
    return 1;
}

void DHCPConflictController::addPairToFirewall(IP_MAC ip_mac_pair)
{
    string command = "sudo nft add element inet " + TABLE + " " + PAIR_SET + " { " + ip_mac_pair.ip + " . " + ip_mac_pair.mac + " }";
    system(command.c_str());
}

void DHCPConflictController::loop()
{
    while (true)
    {
        vector<IP_MAC> list = getNewPairs();
        for (IP_MAC x : list)
        {
            addPairToFirewall(x);
            cout << x.ip << " " << x.mac << "\n";
        }
        // Sleep for 100 milliseconds
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}

DHCPConflictController::DHCPConflictController()
{
    if (init() == 0)
        return;
    loop();
}