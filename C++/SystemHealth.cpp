#include <iostream>
#include <fstream>
#include <sstream>
#include <sys/statvfs.h>
#include <sys/sysinfo.h>
#include <vector>
#include <map>
#include <iomanip>
#include <cstdlib>
#include <fstream>
#include <string>
#include <filesystem>

namespace fs = std::filesystem;

void getRAMStatus() {
    struct sysinfo info;
    if (sysinfo(&info) == 0) {
        std::cout << "RAM Status:" << std::endl;
        std::cout << "Total RAM: " << info.totalram / (1024 * 1024) << " MB" << std::endl;
        std::cout << "Free RAM: " << info.freeram / (1024 * 1024) << " MB" << std::endl;
        std::cout << "Used RAM: " << (info.totalram - info.freeram) / (1024 * 1024) << " MB" << std::endl;
    } else {
        std::cerr << "Failed to get RAM information." << std::endl;
    }
}

void getDiskStatus(const char* path) {
    struct statvfs stat;
    if (statvfs(path, &stat) == 0) {
        unsigned long total = stat.f_blocks * stat.f_frsize;
        unsigned long free = stat.f_bfree * stat.f_frsize;
        unsigned long used = total - free;

        std::cout << "Disk Status for path: " << path << std::endl;
        std::cout << "Total Disk Space: " << total / (1024 * 1024) << " MB" << std::endl;
        std::cout << "Free Disk Space: " << free / (1024 * 1024) << " MB" << std::endl;
        std::cout << "Used Disk Space: " << used / (1024 * 1024) << " MB" << std::endl;
    } else {
        std::cerr << "Failed to get disk information for path: " << path << std::endl;
    }
}

void getAllMountedDisks() {
    std::ifstream mounts("/proc/mounts");
    if (!mounts) {
        std::cerr << "Failed to open /proc/mounts" << std::endl;
        return;
    }
    
    std::string line, mountPoint;
    while (std::getline(mounts, line)) {
        std::istringstream iss(line);
        std::string device, mount, type;
        if (iss >> device >> mount >> type) {
            if (type == "ext4" || type == "xfs" || type == "btrfs" || type == "vfat" || type == "ntfs") {
                getDiskStatus(mount.c_str());
                std::cout << std::endl;
            }
        }
    }
}

void getNetworkTraffic() {
    std::string path = "/sys/class/net/";

    std::cout << "Interface     RX (MB)      TX (MB)" << std::endl;
    std::cout << "---------------------------------" << std::endl;

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

            std::cout << interface << "     " 
                      << rx_bytes / (1024.0 * 1024) << " MB     "
                      << tx_bytes / (1024.0 * 1024) << " MB" 
                      << std::endl;
        }
    }
}

int main() {
    getRAMStatus();
    std::cout << std::endl;
    getAllMountedDisks();
    std::cout << std::endl;
    getNetworkTraffic();
    return 0;
}
