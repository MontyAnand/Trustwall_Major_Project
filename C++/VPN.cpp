#include "headers.h"

bool VPN::setupServer(std::string IP, std::string netmask)
{
    try
    {
        pool = new IPPool(IP, netmask);
        std::pair<int, std::string> p = pool->allocate_ip();
        server_ip = p.second;
        if (!generateServerKeys())
        {
            std::cerr << "Unable to generate Server Keys\n";
            return false;
        }
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
        addFirewallRules();
    }
    catch (fs::filesystem_error &e)
    {
        std::cerr << e.what() << std::endl;
        return false;
    }
    
    return true;
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

void VPN::parseString(std::string &s, std::map<std::string, int> &handsakeTime)
{
    if(s.empty()){
        return;
    }

    std::stringstream ss(s);
    std::string word;
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

void VPN::generateQRCode(std::string &client_ip, std::uint32_t id, std::string &public_key, std::string &private_key)
{
    std::string configuration = "";
    configuration += "[Interface]\n";
    configuration += "PrivateKey = " + private_key + "\n";
    configuration += "Address = " + client_ip + "/" + std::to_string(pool->getNetmask()) + "\n";
    configuration += "DNS = 8.8.8.8\n\n";
    configuration += "[Peer]\n";
    configuration += "PublicKey = " + server_public_key + "\n";
    configuration += "Endpoint = " + Utility::getEndPoint() + ":" + std::to_string(PORT) + "\n";
    configuration += "AllowedIPs = 0.0.0.0/0\n";
    configuration += "PersistentKeepalive = 25\n";
    // std::cout << "data:image/png;base64," << QR::generate_qr_base64(configuration) << std::endl;
    std::string base64Data = "data:image/png;base64," + QR::generate_qr_base64(configuration);
    std::ofstream file((std::to_string(id) + ".qr"));
    // std::cout << "--------------------------- size : " << base64Data.length() << " ---------------------------\n";
    file << base64Data;
    return;
}

std::uint32_t VPN::generateClientConfiguration(std::string &private_key, std::string &public_key)
{
    std::pair<int, std::string> p = pool->allocate_ip();
    std::uint32_t id = p.first;
    std::string client_ip = p.second;
    {
        std::lock_guard<std::mutex> lock(mtx);
        record[public_key] = id;
    }
    std::ofstream file((std::to_string(id) + ".conf"));

    file << "[Interface]\n";
    file << "PrivateKey = " << private_key << "\n";
    file << "Address = " << client_ip << "/" << std::to_string(pool->getNetmask()) << "\n";
    file << "DNS = 8.8.8.8\n\n";
    file << "[Peer]\n";
    file << "PublicKey = " << server_public_key << "\n";
    file << "Endpoint = " << Utility::getEndPoint() << ":" << PORT << "\n";
    file << "AllowedIPs = 0.0.0.0/0\n";
    file << "PersistentKeepalive = 25\n";
    file.close();
    generateQRCode(client_ip, id, public_key, private_key);
    std::string command = "sudo wg set wg0 peer " + public_key + " allowed-ips " + client_ip + "/32 persistent-keepalive 25";
    system(command.c_str());
    return id;
}

std::uint32_t VPN::acceptConnectionRequest()
{
    try
    {
        if (pool == NULL)
        {
            std::cerr << "First define IP and Mask for VPN\n";
            return 0;
        }
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
        std::uint32_t id = generateClientConfiguration(client_private_key, client_public_key);
        if (id == -1)
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

bool VPN::vpnInterfaceSetup()
{
    system("sudo wg-quick down wg0");
    if (system("wg-quick up wg0") != 0)
    {
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
    std::pair<int, std::string> p = pool->allocate_ip();
    file << "[Interface]\n";
    file << "PrivateKey = " << private_key << "\n";
    file << "Address = " << server_ip << "/" << pool->getNetmask() << "\n";
    file << "ListenPort = 51820\n";

    file.close();

    return true;
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
            if (p.second == -1 || p.second > 240)
            {
                std::string command = "sudo wg set wg0 peer " + p.first + " remove";
                system(command.c_str());
                {
                    std::lock_guard<std::mutex> lock(mtx);
                    pool->release_ip(record[p.first]);
                    record.erase(p.first);
                }
            }
        }
    }
    return;
}

void VPN::addFirewallRules()
{
    std::string rule = "sudo nft add rule ip USER_TABLE CUSTOM_RULES iifname \"wg0\" oifname " + Utility::getPublicInterface() + " accept";
    system(rule.c_str());
    rule = "sudo nft add rule ip USER_TABLE CUSTOM_RULES iifname " + Utility::getPublicInterface() + " oifname \"wg0\" ct state established,related accept";
    system(rule.c_str());
    return;
}

VPN::VPN() : PORT(51820), TIMEOUT_PERIOD(30 * 60)
{
    pool = NULL;
    running = true;
    cleaner = std::thread(&VPN::monitorClient, this);
}

VPN::~VPN()
{
    running = false;
    if (cleaner.joinable())
    {
        cleaner.join();
    }
}