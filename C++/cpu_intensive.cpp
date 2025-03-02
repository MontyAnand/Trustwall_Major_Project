#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <map>
#include <thread>
#include <chrono>

struct NetStats {
    std::string iface;
    unsigned long rx_bytes, rx_packets, rx_errs, rx_drop, rx_fifo, rx_frame, rx_compressed, rx_multicast;
    unsigned long tx_bytes, tx_packets, tx_errs, tx_drop, tx_fifo, tx_colls, tx_carrier, tx_compressed;
};

// Function to read network statistics
std::map <std::string, std::vector<unsigned long>> getNetworkStats() {
    std::vector<NetStats> stats;
    std::map<std::string, std::vector<unsigned long>> bytes;
    std::ifstream file("/proc/net/dev");
    std::string line;

    if (!file) {
        std::cerr << "Error: Could not open /proc/net/dev" << std::endl;
        bytes;
    }

    // Skip headers
    std::getline(file, line);
    std::getline(file, line);

    while (std::getline(file, line)) {
        std::istringstream iss(line);
        NetStats ns;
        iss >> ns.iface >> ns.rx_bytes >> ns.rx_packets >> ns.rx_errs >> ns.rx_drop >> ns.rx_fifo >> ns.rx_frame
            >> ns.rx_compressed >> ns.rx_multicast >> ns.tx_bytes >> ns.tx_packets >> ns.tx_errs >> ns.tx_drop
            >> ns.tx_fifo >> ns.tx_colls >> ns.tx_carrier >> ns.tx_compressed;
        
        ns.iface = ns.iface.substr(0, ns.iface.find(':')); // Remove trailing ':'
        bytes[ns.iface] = {ns.rx_bytes, ns.tx_bytes};
    }
    return bytes;
}

int main() {
    std::map<std::string, std::vector<unsigned long>> prev_traffic = getNetworkStats();
    // for (auto p : interface_traffic){
    //     std::cout << p.first << " " << (p.second)[0] << " " << (p.second)[1] << std::endl;
    // }

    while(true){
        std::this_thread::sleep_for(std::chrono::seconds(1));
        std::map<std::string, std::vector<unsigned long>> curr_traffic = getNetworkStats();
        for(auto &p : curr_traffic){
            std::cout << p.first << " " << (double)((p.second)[0] - prev_traffic[p.first][0])/1024.0 << " " << (double)((p.second)[1] - prev_traffic[p.first][1])/1024.0 << std::endl;
        }
        prev_traffic = curr_traffic;
    }
    return 0;
}
