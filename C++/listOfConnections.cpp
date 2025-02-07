#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <iomanip>
#include <arpa/inet.h>

struct ConnectionInfo {
    std::string protocol;
    std::string local_ip;
    int local_port;
    std::string remote_ip;
    int remote_port;
    std::string state;
};

std::vector<ConnectionInfo> getConnections(const std::string& filename, const std::string& protocol) {
    std::ifstream file(filename);
    std::vector<ConnectionInfo> connections;
    
    if (!file) {
        std::cerr << "Failed to open " << filename << std::endl;
        return connections;
    }

    std::string line;
    std::getline(file, line);  // Skip the first line (headers)

    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string sl, local_addr, remote_addr, state;
        int inode;

        iss >> sl >> local_addr >> remote_addr >> state >> std::ws;
        
        // Extract local IP and port
        size_t colon_pos = local_addr.find(':');
        std::string local_ip_hex = local_addr.substr(0, colon_pos);
        std::string local_port_hex = local_addr.substr(colon_pos + 1);

        // Extract remote IP and port
        colon_pos = remote_addr.find(':');
        std::string remote_ip_hex = remote_addr.substr(0, colon_pos);
        std::string remote_port_hex = remote_addr.substr(colon_pos + 1);

        // Convert IP addresses and ports
        struct in_addr local, remote;
        local.s_addr = strtoul(local_ip_hex.c_str(), nullptr, 16);
        remote.s_addr = strtoul(remote_ip_hex.c_str(), nullptr, 16);

        ConnectionInfo conn;
        conn.protocol = protocol;
        conn.local_ip = inet_ntoa(local);
        conn.local_port = strtoul(local_port_hex.c_str(), nullptr, 16);
        conn.remote_ip = inet_ntoa(remote);
        conn.remote_port = strtoul(remote_port_hex.c_str(), nullptr, 16);

        // Connection state mapping
        if (state == "01") conn.state = "ESTABLISHED";
        else if (state == "02") conn.state = "SYN_SENT";
        else if (state == "03") conn.state = "SYN_RECV";
        else if (state == "04") conn.state = "FIN_WAIT1";
        else if (state == "05") conn.state = "FIN_WAIT2";
        else if (state == "06") conn.state = "TIME_WAIT";
        else if (state == "07") conn.state = "CLOSE";
        else if (state == "08") conn.state = "CLOSE_WAIT";
        else if (state == "09") conn.state = "LAST_ACK";
        else if (state == "0A") conn.state = "LISTEN";
        else if (state == "0B") conn.state = "CLOSING";
        else conn.state = "UNKNOWN";

        connections.push_back(conn);
    }

    return connections;
}

void displayConnections(const std::vector<ConnectionInfo>& connections) {
    std::cout << std::left << std::setw(10) << "Protocol" 
              << std::setw(20) << "Local Address" 
              << std::setw(10) << "Port" 
              << std::setw(20) << "Remote Address" 
              << std::setw(10) << "Port" 
              << std::setw(15) << "State" 
              << std::endl;

    std::cout << std::string(85, '-') << std::endl;

    for (const auto& conn : connections) {
        std::cout << std::left << std::setw(10) << conn.protocol
                  << std::setw(20) << conn.local_ip
                  << std::setw(10) << conn.local_port
                  << std::setw(20) << conn.remote_ip
                  << std::setw(10) << conn.remote_port
                  << std::setw(15) << conn.state
                  << std::endl;
    }
}

int main() {
    std::vector<ConnectionInfo> connections;

    // Get TCP and UDP connections
    auto tcp = getConnections("/proc/net/tcp", "TCP");
    auto udp = getConnections("/proc/net/udp", "UDP");
    auto tcp6 = getConnections("/proc/net/tcp6", "TCP6");
    auto udp6 = getConnections("/proc/net/udp6", "UDP6");

    // Combine results
    connections.insert(connections.end(), tcp.begin(), tcp.end());
    connections.insert(connections.end(), udp.begin(), udp.end());
    connections.insert(connections.end(), tcp6.begin(), tcp6.end());
    connections.insert(connections.end(), udp6.begin(), udp6.end());

    // Display
    displayConnections(connections);

    return 0;
}
