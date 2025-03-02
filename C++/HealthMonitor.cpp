#include "headers.h"

json HealthMonitor::parseMpstatOutput(const std::string& line){
    if(line.size() == 0)return json();
    std::istringstream linestream(line);
    std::string token;
    std::vector<std::string> words;

    // Tokenize the line
    while (linestream >> token) {
        words.push_back(token);
    }

    // Skip headers and invalid lines
    if (words.size() < 13 || words[0] == "Linux" || words[2] == "CPU") return json();

    try {
        // Extract required fields
        double usr = std::stod(words[3]);     // %usr
        double sys = std::stod(words[5]);     // %sys
        double iowait = std::stod(words[6]);  // %iowait
        double idle = std::stod(words[12]);   // %idle
        double other = 100.0 - (usr + sys + iowait + idle); // %other

        return json({
            {"CPU", words[2]},
            {"usr", usr},
            {"sys", sys},
            {"iowait", iowait},
            {"idle", idle},
            {"other", other}
        });
    } catch (...) {
        return json();
    }
    return json();
}
std::string HealthMonitor::getCPUStatusJSON(){
    json result = json::array();
    const char* command = "mpstat -P ALL"; 
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(command, "r"), pclose);
    if (!pipe) {
        std::cerr << "Error: Failed to run mpstat command!\n";
        return "";
    }

    char buffer[256];
    while (fgets(buffer, sizeof(buffer), pipe.get()) != nullptr) {
        json data = parseMpstatOutput(buffer);
        if(!data.empty()){
            result.push_back(data);
        }
    }
    return result.dump();
}

bool HealthMonitor::validService (std::string &service){
    if(service.length() < 8) return false;
    return service.substr(service.length() - 8) == ".service";
}

std::string HealthMonitor::getServicesJSON(){
    json data = json::array();
    const char* cmd = "systemctl list-units --type=service --all";
    FILE* pipe = popen(cmd, "r");
    if (!pipe) {
        std::cerr << "Failed to run command\n";
        return data.dump();
    }
    char buffer[512];
    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        std::stringstream ss(buffer);
        std::string first, second, third, fourth;
        ss >> first >> second >> third >> fourth;

        // Remove the leading dot (UTF-8 character "●" = "\u25CF" = "\xE2\x97\x8F")
        if (first.find("●") != std::string::npos) {
            first = first.substr(3); // Skip first 3 bytes (UTF-8 character length)
        }

        if(!validService(first))continue;
        if (!first.empty() && !second.empty() && !third.empty() && !fourth.empty()) {
            int active = 0;
            if(third == "active"){
                active = 1;
            }
            data.push_back({
                {"service", first},
                {"isActive", active},
                {"status", fourth}
            });
        }
    }
    pclose(pipe);
    return data.dump();
}

int HealthMonitor::getRamStatus(struct sysinfo *info)
{
    return sysinfo(info);
}

struct disk_info HealthMonitor::getDiskStatus(const char *path)
{
    struct statvfs stat;
    struct disk_info result = {path, 0};
    if (statvfs(path, &stat) == 0)
    {
        unsigned long total = stat.f_blocks * stat.f_frsize;
        unsigned long free = stat.f_bfree * stat.f_frsize;
        result.percentageUsed = ((double)(total - free) / (double)total) * 100;
    }
    return result;
}

std::vector<struct disk_info> HealthMonitor::getAllMountedDisks()
{
    std::vector<struct disk_info> result;
    std::ifstream mounts("/proc/mounts");
    if (!mounts)
    {
        std::cerr << "Failed to open /proc/mounts" << std::endl;
        return result;
    }

    std::string line, mountPoint;
    while (std::getline(mounts, line))
    {
        std::istringstream iss(line);
        std::string device, mount, type;
        if (iss >> device >> mount >> type)
        {
            if (type == "ext4" || type == "xfs" || type == "btrfs" || type == "vfat" || type == "ntfs")
            {
                result.push_back(getDiskStatus(mount.c_str()));
            }
        }
    }
    return result;
}

std::vector<struct interface_info> HealthMonitor::getNetworkTraffic()
{
    std::vector<struct interface_info> result;
    std::string path = "/sys/class/net/";
    for (const auto &entry : fs::directory_iterator(path))
    {
        std::string interface = entry.path().filename();

        std::string rx_path = path + interface + "/statistics/rx_bytes";
        std::string tx_path = path + interface + "/statistics/tx_bytes";

        std::ifstream rx_file(rx_path);
        std::ifstream tx_file(tx_path);

        if (rx_file && tx_file)
        {
            unsigned long rx_bytes, tx_bytes;
            rx_file >> rx_bytes;
            tx_file >> tx_bytes;

            result.push_back({interface, (float)rx_bytes / 1024, (float)tx_bytes});
        }
    }
    return result;
}

std::vector<connection_info> HealthMonitor::getProtocolSpecificConnections(const std::string &filename, const std::string &protocol)
{
    std::ifstream file(filename);
    std::vector<connection_info> connections;

    if (!file)
    {
        std::cerr << "Failed to open " << filename << std::endl;
        return connections;
    }

    std::string line;
    std::getline(file, line); // Skip the first line (headers)

    while (std::getline(file, line))
    {
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
        if (state == "01")
            conn.state = "ESTABLISHED";
        else if (state == "02")
            conn.state = "SYN_SENT";
        else if (state == "03")
            conn.state = "SYN_RECV";
        else if (state == "04")
            conn.state = "FIN_WAIT1";
        else if (state == "05")
            conn.state = "FIN_WAIT2";
        else if (state == "06")
            conn.state = "TIME_WAIT";
        else if (state == "07")
            conn.state = "CLOSE";
        else if (state == "08")
            conn.state = "CLOSE_WAIT";
        else if (state == "09")
            conn.state = "LAST_ACK";
        else if (state == "0A")
            conn.state = "LISTEN";
        else if (state == "0B")
            conn.state = "CLOSING";
        else
            conn.state = "UNKNOWN";

        connections.push_back(conn);
    }

    return connections;
}

std::vector<connection_info> HealthMonitor::getNetworkConnections()
{
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

std::string HealthMonitor::ramInfoJSON(struct sysinfo &status)
{
    json data = {{"total", (double)status.totalram / (1024 * 1024)},
                 {"free", (double)status.freeram / (1024 * 1024)}};
    return data.dump();
}

std::string HealthMonitor::diskInfoJSON(std::vector<struct disk_info> &mountedDisk)
{
    json data = json::array();
    for (auto &info : mountedDisk)
    {
        data.push_back({{"path", info.path},
                        {"used", info.percentageUsed}});
    }

    return data.dump();
}

std::string HealthMonitor::networkTrafficJSON(std::vector<struct interface_info> &interfaces)
{
    json data = json::array();
    for (auto &interface : interfaces)
    {
        data.push_back({{"interface", interface.interface},
                        {"received", interface.received_data},
                        {"sent", interface.transmitted_data}});
    }
    return data.dump();
}

std::string HealthMonitor::networkListJSON(std::vector<connection_info> &networkList)
{
    json data = json::array();
    for (auto &connection : networkList)
    {
        data.push_back({{"protocol", connection.protocol},
                        {"local_ip", connection.local_ip},
                        {"local_port", connection.local_port},
                        {"remote_ip", connection.remote_ip},
                        {"remote_port", connection.remote_port},
                        {"state", connection.state}});
    }

    return data.dump();
}

std::map <std::string, std::vector<unsigned long>> HealthMonitor::getNetworkStats(){
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