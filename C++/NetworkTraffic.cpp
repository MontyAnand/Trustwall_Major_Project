#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>

namespace fs = std::filesystem;

void getNetworkTraffic()
{
    std::string path = "/sys/class/net/";

    std::cout << "Interface     RX (MB)      TX (MB)" << std::endl;
    std::cout << "---------------------------------" << std::endl;

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

            std::cout << interface << "     "
                      << rx_bytes / (1024.0 * 1024) << " MB     "
                      << tx_bytes / (1024.0 * 1024) << " MB"
                      << std::endl;
        }
    }
}

int main()
{
    getNetworkTraffic();
    return 0;
}
