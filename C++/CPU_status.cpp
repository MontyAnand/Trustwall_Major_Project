#include <iostream>
#include <fstream>
#include <sstream>
#include <thread>
#include <vector>
#include <chrono>

struct CPUStats {
    std::string name;
    long user, nice, system, idle, iowait, irq, softirq, steal;
    
    long total() const {
        return user + nice + system + idle + iowait + irq + softirq + steal;
    }

    long active() const {
        return user + nice + system + irq + softirq + steal;
    }
};

std::vector<CPUStats> getCPUStats() {
    std::ifstream file("/proc/stat");
    std::vector<CPUStats> stats;
    std::string line;

    while (std::getline(file, line)) {
        std::istringstream ss(line);
        CPUStats cpu;
        ss >> cpu.name;
        if (cpu.name.find("cpu") == std::string::npos) break;

        ss >> cpu.user >> cpu.nice >> cpu.system >> cpu.idle >> cpu.iowait 
           >> cpu.irq >> cpu.softirq >> cpu.steal;

        stats.push_back(cpu);
    }
    return stats;
}

void printCPUUsage() {
    std::cout << "Collecting CPU usage data...\n";
    
    auto prev_stats = getCPUStats();
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));  // 1 second delay
    auto curr_stats = getCPUStats();

    std::cout << "Core    Usage (%)\n";
    std::cout << "-----------------\n";

    for (size_t i = 0; i < curr_stats.size(); ++i) {
        long prev_active = prev_stats[i].active();
        long prev_total = prev_stats[i].total();
        long curr_active = curr_stats[i].active();
        long curr_total = curr_stats[i].total();

        double usage = (static_cast<double>(curr_active - prev_active) / (curr_total - prev_total)) * 100.0;

        std::cout << curr_stats[i].name << "    " << usage << "%\n";
    }
}

int main() {
    while (true) {
        printCPUUsage();
        std::this_thread::sleep_for(std::chrono::seconds(2));  // Update every 2 seconds
        std::cout << "\n";
    }
    return 0;
}
