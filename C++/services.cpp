#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <sstream>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

bool validService (std::string &service){
    if(service.length() < 8) return false;
    return service.substr(service.length() - 8) == ".service";
}

std::string listServices() {
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

int main() {
    std::cout << listServices();
    return 0;
}
