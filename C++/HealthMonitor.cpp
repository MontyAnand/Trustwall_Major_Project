#include "headers.h"

int HealthMonitor::getRamStatus(struct sysinfo * info){
    return sysinfo(info);
}

struct disk_info HealthMonitor::getDiskStatus(const char *path){
    struct statvfs stat;
    struct disk_info result = {path,0};
    if (statvfs(path, &stat) == 0) {
        unsigned long total = stat.f_blocks * stat.f_frsize;
        unsigned long free = stat.f_bfree * stat.f_frsize;
        result.percentageUsed = ((double)(total-free)/(double)total)*100;
    }
    return result;
}

std::vector<struct disk_info> HealthMonitor::getAllMountedDisks(){
    std::vector <struct disk_info> result;
    std::ifstream mounts("/proc/mounts");
    if (!mounts) {
        std::cerr << "Failed to open /proc/mounts" << std::endl;
        return result;
    }
    
    std::string line, mountPoint;
    while (std::getline(mounts, line)) {
        std::istringstream iss(line);
        std::string device, mount, type;
        if (iss >> device >> mount >> type) {
            if (type == "ext4" || type == "xfs" || type == "btrfs" || type == "vfat" || type == "ntfs") {
                result.push_back(getDiskStatus(mount.c_str()));
            }
        }
    }
    return result;
}

std::vector<struct interface_info> HealthMonitor::getNetworkTraffic(){
    std::vector <struct interface_info> result;
    std::string path = "/sys/class/net/";
    for (const auto& entry : fs::directory_iterator(path)) {
        std::string interface = entry.path().filename();

        std::string rx_path = path + interface + "/statistics/rx_bytes";
        std::string tx_path = path + interface + "/statistics/tx_bytes";

        std::ifstream rx_file(rx_path);
        std::ifstream tx_file(tx_path);

        if (rx_file && tx_file) {
            unsigned long rx_bytes, tx_bytes;
            rx_file >> rx_bytes;
            tx_file >> tx_bytes;

            result.push_back({interface, (float)rx_bytes/1024 , (float)tx_bytes});
        }
    }
    return result;
}


std::vector<connection_info> HealthMonitor::getProtocolSpecificConnections(const std::string& filename, const std::string& protocol){
    std::ifstream file(filename);
    std::vector<connection_info> connections;
    
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

        connection_info conn;
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

std::vector<connection_info> HealthMonitor::getNetworkConnections(){
    std::vector<connection_info> connections;

    // Get TCP and UDP connections
    auto tcp = getProtocolSpecificConnections("/proc/net/tcp", "TCP");
    auto udp = getProtocolSpecificConnections("/proc/net/udp", "UDP");
    auto tcp6 = getProtocolSpecificConnections("/proc/net/tcp6", "TCP6");
    auto udp6 = getProtocolSpecificConnections("/proc/net/udp6", "UDP6");

    // Combine results
    connections.insert(connections.end(), tcp.begin(), tcp.end());
    connections.insert(connections.end(), udp.begin(), udp.end());
    connections.insert(connections.end(), tcp6.begin(), tcp6.end());
    connections.insert(connections.end(), udp6.begin(), udp6.end());

    return connections;
}

std::string HealthMonitor::ramInfoJSON (struct sysinfo &status){
    json data = {{"total" , (double)status.totalram / (1024*1024)},
            {"free" , (double)status.freeram / (1024*1024) }
    };
    return data.dump();
}

std::string HealthMonitor::diskInfoJSON (std::vector<struct disk_info>& mountedDisk){
    json data =json::array();
    for(auto &info : mountedDisk){
        data.push_back({
            {"path", info.path},
            {"used", info.percentageUsed}
        });
    }

    return data.dump();
}

std::string HealthMonitor::networkTrafficJSON (std::vector<struct interface_info> &interfaces){
    json data = json::array();
    for(auto &interface : interfaces){
        data.push_back({
            {"interface",interface.interface},
            {"received" , interface.received_data},
            {"sent" , interface.transmitted_data}
        });
    }
    return data.dump();
}

std::string HealthMonitor::networkListJSON(std::vector<connection_info>&networkList){
    json data = json::array();
    for(auto &connection : networkList){
        data.push_back({
            {"protocol", connection.protocol},
            {"local_ip", connection.local_ip},
            {"local_port", connection.local_port},
            {"remote_ip", connection.remote_ip},
            {"remote_port", connection.remote_port},
            {"state", connection.state}
        });
    }

    return data.dump();
}