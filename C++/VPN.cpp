#include "headers.h"

VPN::VPN() : ip_pool(1), netmask("10.2.0."), PORT(51820), running(true), TIMEOUT_PERIOD(10*60)
{
    system("sudo wg-quick down wg0");
    if(! checkConnectivity()){
        std::cerr << "Make sure you are connected to Internet\n";
        exit(1);
    }
    publicInterface = getPublicInterface();
    if (!publicInterface.empty())
    {
        endPoint = getEndPoint();
    }
    else{
        std::cerr << "Unable to detect public Interface\n";
        exit(1);
    }

    if (!generateServerKeys())
    {
        exit(1);
    }
    if (!setupServer())
    {
        exit(1);
    }
    // Start cleaner thread to revoke unsuded resources
    addFirewallRules();
    cleaner = std::thread(&VPN::monitorClient, this);
}

VPN:: ~VPN (){
    running = false;
    if (cleaner.joinable()){
        cleaner.join();
    }
}

bool VPN::checkConnectivity()
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




std::string VPN::getPublicInterface()
{
    const std::string command = "ip route get 8.8.8.8 | awk '/dev/ {print $5}'";
    std::array<char, 128> buffer;
    std::string interface;

    FILE *pipe = popen(command.c_str(), "r");

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

std::string VPN::getEndPoint()
{
    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd < 0)
    {
        perror("socket");
        return "";
    }
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

bool VPN::generateServerKeys()
{
    try
    {
        std::array<char, 128> buffer;
        std::string temp;

        std::string current_directory = fs::current_path();
        fs::current_path("/etc/wireguard");
        // Generating Private key for server
        std::string command = "wg genkey | tee private.key | wg pubkey > public.key";

        if (system(command.c_str()) != 0)
        {
            throw std::runtime_error("Unable to generate Private or Public key for server");
        }

        fs::current_path(current_directory);

        return true;
    }
    catch (const fs::filesystem_error &e)
    {
        std::cerr << e.what() << std::endl;
    }

    return false;
}

std::string VPN::prepareIP(std::uint16_t id)
{
    if (id == 0 || id > 255)
        return "";
    std::string IP = netmask;
    IP += std::to_string(id);
    return IP;
}

std::uint16_t VPN::getAvailableID()
{
    std::uint16_t current = 0;
    for (current; current < 64; current++)
    {
        if ((ip_pool & (1 << 1 * current)) == 0)
        {
            break;
        }
    }
    if (current == 64)
    {
        return 0;
    }
    ip_pool = ip_pool | (1 << current);
    return current + 1;
}

void VPN::revokeIP(std::uint16_t id)
{
    id--;
    if (id >= 64 || id < 0)
    {
        return;
    }

    ip_pool = ip_pool ^ (1 << id);
    return;
}

bool VPN::setupServer()
{
    try
    {
        std::string current_path = fs::current_path();
        fs::current_path("/etc/wireguard");
        std::string private_key;
        std::string command = "cat private.key";
        FILE *pipe = popen(command.c_str(), "r");

        std::array<char, 128> buffer;
        if (!pipe)
        {
            throw std::runtime_error("Unable to get private key of the server");
        }

        while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
        {
            private_key += buffer.data();
        }

        private_key.erase(private_key.find_last_not_of(" \n\r\t") + 1);

        pclose(pipe);

        command = "cat public.key";

        pipe = popen(command.c_str(), "r");

        if (!pipe)
        {
            throw std::runtime_error("Unable to get Public Key of the server");
        }

        while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
        {
            server_public_key += buffer.data();
        }

        server_public_key.erase(server_public_key.find_last_not_of(" \n\r\t") + 1);

        pclose(pipe);

        // std::cout << "Private Key : " << private_key << "\nPublic Key : " << server_public_key << std::endl;
        if (!generateConfigurationFile(private_key))
        {
            throw std::runtime_error("Unable to write Configuration");
        }

        if (!vpnInterfaceSetup())
        {
            throw std::runtime_error("Unable to setup Wireguard Interface");
        }

        fs::current_path(current_path);
    }
    catch (fs::filesystem_error &e)
    {
        std::cerr << e.what() << std::endl;
        return false;
    }
    return true;
}

bool VPN::generateConfigurationFile(std::string &private_key)
{
    std::ofstream file("wg0.conf");
    if (!file)
    {
        std::cerr << "Configuration File Opening error\n";
        return false;
    }

    file << "[Interface]\n";
    file << "PrivateKey = " << private_key << "\n";
    file << "Address = 10.2.0.1/24\n";
    file << "ListenPort = 51820\n";

    file.close();

    return true;
}

bool VPN::vpnInterfaceSetup()
{
    if (system("wg-quick up wg0") != 0)
    {
        return false;
    }
    return true;
}

std::uint16_t VPN::acceptConnectionRequest()
{
    try
    {
        std::string client_private_key, client_public_key;
        std::string command = "wg genkey";
        std::array<char, 128> buffer;
        FILE *pipe = popen(command.c_str(), "r");
        if (!pipe)
        {
            throw std::runtime_error("Unable to generate Private key for Client");
        }
        while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
        {
            client_private_key += buffer.data();
        }
        pclose(pipe);
        client_private_key.erase(client_private_key.find_last_not_of(" \n\r\t") + 1);
        command = "echo " + client_private_key + " | wg pubkey";
        pipe = popen(command.c_str(), "r");
        if (!pipe)
        {
            throw std::runtime_error("Unable to generate Public Key for Client");
        }
        while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
        {
            client_public_key += buffer.data();
        }
        pclose(pipe);
        client_public_key.erase(client_public_key.find_last_not_of(" \n\r\t") + 1);
        std::uint16_t id = generateClientConfiguration(client_private_key, client_public_key);
        if (id < 1)
        {
            throw std::runtime_error("Unable to generate client configuration");
        }
        // std::cout << "Configuration file : " << id << ".conf\n";
        return id;
    }
    catch (std::exception &e)
    {
        std::cerr << e.what() << std::endl;
        return 0;
    }
    catch (...)
    {
        std::cerr << "Non caught error" << std::endl;
        return 0;
    }
    return 0;
}

std::uint16_t VPN::generateClientConfiguration(std::string &private_key, std::string &public_key)
{
    std::uint16_t id = getAvailableID();
    std::string client_ip = prepareIP(id);
    std::string server_ip = prepareIP(1);
    {
        std::lock_guard <std::mutex> lock(mtx);
        record[public_key] = id;
    }
    std::ofstream file((std::to_string(id) + ".conf"));

    file << "[Interface]\n";
    file << "PrivateKey = " << private_key << "\n";
    file << "Address = " << client_ip << "/24\n";
    file << "DNS = 8.8.8.8\n\n";
    file << "[Peer]\n";
    file << "PublicKey = " << server_public_key << "\n";
    file << "Endpoint = " << endPoint << ":" << PORT << "\n";
    file << "AllowedIPs = 0.0.0.0/0\n";
    file << "PersistentKeepalive = 25\n";
    file.close();
    generateQRCode(id, public_key, private_key);
    std::string command = "sudo wg set wg0 peer " + public_key + " allowed-ips " + client_ip + "/32 persistent-keepalive 25";
    system(command.c_str());
    return id;
}

void VPN::generateQRCode(std::uint16_t id, std::string &public_key, std::string &private_key)
{
    std::string client_ip = prepareIP(id);
    std::string server_ip = prepareIP(1);
    std::string configuration = "";
    configuration += "[Interface]\n";
    configuration += "PrivateKey = " + private_key + "\n";
    configuration += "Address = " + client_ip + "/24\n";
    configuration += "DNS = 8.8.8.8\n\n";
    configuration += "[Peer]\n";
    configuration += "PublicKey = " + server_public_key + "\n";
    configuration += "Endpoint = " + endPoint + ":" + std::to_string(PORT) + "\n";
    configuration += "AllowedIPs = 0.0.0.0/0\n";
    configuration += "PersistentKeepalive = 25\n";
    // std::cout << "data:image/png;base64," << QR::generate_qr_base64(configuration) << std::endl;
    std::string  base64Data = "data:image/png;base64," + QR::generate_qr_base64(configuration);
    std::ofstream file((std::to_string(id) + ".qr"));
    // std::cout << "--------------------------- size : " << base64Data.length() << " ---------------------------\n";
    file << base64Data;
    return;
}

void VPN::monitorClient()
{
    while (running)
    {
        std::this_thread::sleep_for(std::chrono::seconds(TIMEOUT_PERIOD));
        std::string data;
        std::array<char, 128> buffer;
        FILE *pipe = popen("sudo wg show wg0", "r");
        if (!pipe)
        {
            std::cerr << "Unable to start monitoring the VPN clients\n";
            return;
        }
        while (fgets(buffer.data(), buffer.size(), pipe) != nullptr)
        {
            data += buffer.data();
        }
        std::map<std::string, int> handsakeTime;
        parseString(data, handsakeTime);

        for (auto &p : handsakeTime)
        {
            // std::cout << p.first << " : " << p.second << std::endl;
            if(p.second == -1 || p.second > 240){
                std::string command = "sudo wg set wg0 peer " + p.first + " remove";
                system(command.c_str());
                {
                    std::lock_guard <std::mutex> lock(mtx);
                    revokeIP(record[p.first]);
                    record.erase(p.first);
                }
            }
        }
    }
    return;
}

void VPN::parseString(std::string &s, std::map<std::string, int> &handsakeTime)
{
    std::stringstream ss(s);
    std::string word;
    // std::cout << "Command output parsed word by word:\n";
    while (ss >> word)
    {
        if (word == "peer:")
        {
            ss >> word;
            std::string pub_key = word;
            handsakeTime.insert(std::make_pair(word, -1));
            while (true)
            {
                ss >> word;
                if (word == "persistent")
                {
                    break;
                }
                if (word == "latest")
                {
                    ss >> word;
                    int time = 0;
                    while (true)
                    {
                        ss >> word;
                        if (word == "ago")
                        {
                            break;
                        }
                        if (isNumber(word))
                        {
                            time += stoi(word);
                        }
                        else
                        {
                            time *= 60;
                        }
                    }
                    handsakeTime[pub_key] = time / 60;
                }
            }
        }
    }
    return;
}

bool VPN::isNumber(std::string &word)
{
    if (word.empty())
        return false;
    for (char c : word)
    {
        if (c < '0' || c > '9')
            return false;
    }
    return true;
}

std::string VPN::getIP(){
    return endPoint;
}

void VPN::addFirewallRules(){
    system("sudo nft add table ip VPN");
    system("sudo nft add chain ip VPN wg_prerouting '{ type nat hook prerouting priority 0; policy accept; }'");
    system("sudo nft add chain ip VPN wg_postrouting '{ type nat hook postrouting priority 100 ; policy accept ; }'");
    std::string rule = "sudo nft add rule ip VPN wg_postrouting oifname " + publicInterface +" masquerade";
    system(rule.c_str());

    system("sudo nft add chain ip VPN wg_forward '{ type filter hook forward priority 0 ; policy drop ; }'");
    rule = "sudo nft add rule ip VPN wg_forward iifname \"wg0\" oifname " + publicInterface + " accept" ;
    system(rule.c_str());
    rule = "sudo nft add rule ip VPN wg_forward iifname " + publicInterface + " oifname \"wg0\" ct state established,related accept";
    system(rule.c_str());
    return;
}