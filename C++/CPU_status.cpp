#include <iostream>
#include <sstream>
#include <vector>
#include <cstdio>
#include <memory>

void parseMpstatOutput(const std::string& line) {
    if(line.size() == 0)return;
    std::istringstream linestream(line);
    std::string token;
    std::vector<std::string> words;

    // Tokenize the line
    while (linestream >> token) {
        words.push_back(token);
    }

    // Skip headers and invalid lines
    if (words.size() < 11 || words[0] == "Linux" || words[2] == "CPU") return;

    try {
        // Extract required fields
        double usr = std::stod(words[3]);     // %usr
        double sys = std::stod(words[4]);     // %sys
        double iowait = std::stod(words[5]);  // %iowait
        double idle = std::stod(words[12]);   // %idle
        double other = 100.0 - (usr + sys + iowait + idle); // %other

        // Print results
        std::cout << "CPU: " << words[2] << " | %usr: " << usr
                  << " | %sys: " << sys
                  << " | %iowait: " << iowait
                  << " | %idle: " << idle
                  << " | %other: " << other << "\n";
    } catch (...) {
        std::cerr << "Error parsing line: " << line << "\n";
    }
}

int main() {
    const char* command = "mpstat -P ALL";  // Run mpstat once

    // Open process with popen
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(command, "r"), pclose);
    if (!pipe) {
        std::cerr << "Error: Failed to run mpstat command!\n";
        return 1;
    }

    // Read output line by line and parse it
    char buffer[256];
    while (fgets(buffer, sizeof(buffer), pipe.get()) != nullptr) {
        parseMpstatOutput(buffer);
    }

    return 0;
}
