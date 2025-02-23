#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <sstream>

bool validService (std::string &service){
    if(service.length() < 8) return false;
    return service.substr(service.length() - 8) == ".service";
}

void listServices() {
    // const char* cmd = "systemctl list-units --type=service --all --no-pager";
    const char* cmd = "systemctl list-units --type=service --all";
    FILE* pipe = popen(cmd, "r");
    if (!pipe) {
        std::cerr << "Failed to run command\n";
        return;
    }

    std::string line;
    char buffer[512];

    // Print header
    std::cout << "UNIT                              LOAD      ACTIVE   SUB\n";
    std::cout << "-------------------------------------------------------------\n";

    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        std::stringstream ss(buffer);
        std::string first, second, third, fourth;

        // Extract first four columns
        ss >> first >> second >> third >> fourth;

        // Remove the leading dot (UTF-8 character "●" = "\u25CF" = "\xE2\x97\x8F")
        if (first.find("●") != std::string::npos) {
            first = first.substr(3); // Skip first 3 bytes (UTF-8 character length)
        }

        if(!validService(first))continue;

        // Print formatted output
        if (!first.empty() && !second.empty() && !third.empty() && !fourth.empty()) {
            std::cout << first << "\t" << second << "\t" << third << "\t" << fourth << "\n";
        }
    }

    pclose(pipe);
}

int main() {
    listServices();
    return 0;
}
