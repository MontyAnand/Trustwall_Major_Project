#include "headers.h"

bool Utility::checkConnectivity()
{
    FILE *pipe = popen("bash -c 'nmcli network connectivity'", "r");
    char buffer[20];
    std::string status = "";

    while (fgets(buffer, sizeof(buffer), pipe) != nullptr)
    {
        status += buffer; // Append to the result string
    }
    pclose(pipe); // Close the pipe

    status = status.substr(0, status.find_last_not_of("\n\t ") + 1);
    // std::cout << status << std::endl;
    return (status == "full");
}

std::string Utility::getPublicInterface()
{
    const std::string command = "ip route get 8.8.8.8 | awk '/dev/ {print $5}'";
    std::array<char, 128> buffer;
    std::string interface;

    FILE *pipe = popen(command.c_str(), "r"); //

    if (!pipe)
    {
        perror("Enable to open popen");
        return std::string("");
    }

    while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
    {
        interface += buffer.data();
    }

    pclose(pipe);

    interface.erase(interface.find_last_not_of(" \n\r\t") + 1);
    return interface;
}

std::string Utility::getEndPoint()
{
    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd < 0)
    {
        perror("socket");
        return "";
    }
    std::string publicInterface = getPublicInterface();
    struct ifreq ifr;
    std::strncpy(ifr.ifr_name, publicInterface.c_str(), IFNAMSIZ - 1);
    ifr.ifr_name[IFNAMSIZ - 1] = '\0'; // Ensure null termination
    // Fetch IP address
    if (ioctl(fd, SIOCGIFADDR, &ifr) < 0)
    {
        perror("ioctl");
        close(fd);
        return "";
    }

    close(fd);

    // Convert to readable format
    struct sockaddr_in *ipaddr = (struct sockaddr_in *)&ifr.ifr_addr;
    return inet_ntoa(ipaddr->sin_addr);
}

void Utility::setEnvironmentVariable(std::string key, std::string value)
{
    const std::string filepath = "/srv/Trustwall_ENV.txt";
    std::ifstream infile(filepath);
    std::vector<std::string> lines;
    std::string line;
    bool found = false;

    // Read all lines and check for existing key
    while (std::getline(infile, line))
    {
        if (line.find(key + "=") == 0)
        {
            line = key + "=\"" + value + "\"";
            found = true;
        }
        lines.push_back(line);
    }
    infile.close();

    // If not found, add new line
    if (!found)
    {
        lines.push_back(key + "=\"" + value + "\"");
    }

    // Write back to the file
    std::ofstream outfile(filepath, std::ios::trunc);
    for (const auto &l : lines)
    {
        outfile << l << std::endl;
    }
    outfile.close();
    return;
}
