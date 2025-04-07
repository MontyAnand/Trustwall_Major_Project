#include "headers.h"

void Server::setNonBlocking(int fd)
{
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

int Server::createServerSocket()
{
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1)
    {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // Allow reuse of address and port
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in server_addr{};
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(SERVER_PORT);

    if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1)
    {
        perror("bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, SOMAXCONN) == -1)
    {
        perror("listen failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    setNonBlocking(server_fd);
    std::cout << "C++ Server started\n";
    return server_fd;
}

void Server::addToInputEventLoop(int fd)
{
    struct epoll_event event{};
    event.events = EPOLLIN;
    event.data.fd = fd;
    epoll_ctl(epollFd, EPOLL_CTL_ADD, fd, &event);
}

void Server::addToOutputEventLoop(int fd)
{
    struct epoll_event event{};
    event.events = EPOLLOUT;
    event.data.fd = fd;
    epoll_ctl(epollFd, EPOLL_CTL_ADD, fd, &event);
}

void Server::eventLoop()
{
    while (true)
    {
        int event_count = epoll_wait(epollFd, events, MAX_EVENTS, -1);
        if (event_count == -1)
        {
            // perror("epoll_wait failed");
            continue;
        }

        for (int i = 0; i < event_count; i++)
        {
            int fd = events[i].data.fd;

            if (fd == serverSocketFd)
            {
                // Accept new client
                struct sockaddr_in client_addr{};
                socklen_t client_len = sizeof(client_addr);
                int client_fd = accept(serverSocketFd, (struct sockaddr *)&client_addr, &client_len);
                if (client_fd == -1)
                {
                    perror("accept failed");
                    continue;
                }

                setNonBlocking(client_fd);
                addToInputEventLoop(client_fd);
                connectedFd.insert(client_fd);

                std::cout << "New client connected: " << client_fd << std::endl;
            }
            else if (events[i].events & EPOLLIN)
            {
                // Read data from client
                char buffer[BUFFER_SIZE] = {0};
                int bytes_read = read(fd, buffer, sizeof(buffer));

                if (bytes_read <= 0)
                {
                    std::cout << "Client disconnected: " << fd << std::endl;
                    connectedFd.erase(fd);
                    epoll_ctl(epollFd, EPOLL_CTL_DEL, fd, nullptr);
                    close(fd);
                }
                else
                {
                    processPacket(buffer, fd, bytes_read);
                }
            }
            else if (events[i].events & EPOLLOUT)
            {

                // Send data to client

                addToInputEventLoop(fd);
            }
        }
    }
    running = false;
}

void Server::startNodeServer(std::string IP)
{
    std::string command = "cd ../Backend && node index.js " + IP;
    system(command.c_str());
}

void Server::processPacket(char *buffer, int fd, int size)
{
    int flag = (int)(char)buffer[0];
    switch (flag)
    {
    case 0:
    {
        {
            std::lock_guard<std::mutex> lock(fileScanMTX);
            antivirusQueue.push(std::make_pair(fd, buffer));
        }
        break;
    }
    case 2:
    {
        {
            std::lock_guard<std::mutex> lock(vpnMTX);
            vpnQueue.push(std::make_pair(fd, buffer));
        }
        break;
    }
    case 8:
    {
        handleAuthentication(buffer, fd);
        break;
    }
    case 10:
    {
        handleServiceListRequest(fd);
        break;
    }
    case 12:
    {
        handleCPUStatusRequest(fd);
        break;
    }
    case 14:
    {
        manageServiceRequest(buffer);
        break;
    }
    case 15:
    {
        Executor::executeCommand(buffer, fd);
    }
    case 18:
    {
        handleInterfaceRequest(buffer, fd);
    }
    case 20:
    {
        Interface::changeInterfaceConfiguration(buffer, size, fd);
        break;
    }
    case 22:
    {
        handleLANInterfaceDetailsRequest(fd);
        break;
    }
    default:
        break;
    }
}

void Server::handleLANInterfaceDetailsRequest(int fd)
{
    std::string data = Interface::getLANInterfaceDetails();
    std::vector<uint8_t> byteArray;
    uint8_t flag = 23;
    byteArray.push_back(flag);
    byteArray.insert(byteArray.end(), data.begin(), data.end());
    send(fd, byteArray.data(), byteArray.size(), 0);
    return;
}

void Server::handleBlockingRequest()
{
    int fd;
    std::string filename;
    char *buffer;
    int turn = 0;
    while (running)
    {
        switch (turn)
        {
        case 0:
        {
            filename = "";
            {
                std::lock_guard<std::mutex> lock(fileScanMTX);
                if (antivirusQueue.empty())
                    break;
                auto p = antivirusQueue.front();
                antivirusQueue.pop();
                fd = p.first;
                buffer = p.second;
            }
            int size = (int)buffer[1];
            for (int i = 0; i < size; i++)
            {
                filename = filename + buffer[2 + i];
            }
            std::cout << "Antivirus request : " << filename << "\n";
            if (Antivirus::startScanning(filename) != 1)
            {
                size = 0;
            }
            char response[2 + filename.length()];
            response[0] = 1;
            response[1] = size;
            for (int i = 0; i < filename.length(); i++)
            {
                response[i + 2] = filename[i];
            }
            send(fd, response, sizeof(response), 0);
        }
        case 1:
        {
            {
                std::lock_guard<std::mutex> lock(vpnMTX);
                if (vpnQueue.empty())
                    break;
                auto p = vpnQueue.front();
                vpnQueue.pop();
                fd = p.first;
                buffer = p.second;
            }
            int id = vpn.acceptConnectionRequest();
            char response[5];
            response[0] = 3;
            std::memcpy(&response[1], &id, sizeof(id));
            send(fd, response, 5, 0);
        }
        default : {
            break;
        }
        }
        turn = (turn + 1)%2;
    }
    return;
}

void Server::handleVPNRequest()
{
    int fd;
    char *buffer;
    while (running)
    {
        {
            std::lock_guard<std::mutex> lock(vpnMTX);
            if (vpnQueue.empty())
                continue;
            auto p = vpnQueue.front();
            vpnQueue.pop();
            fd = p.first;
            buffer = p.second;
        }
        int id = vpn.acceptConnectionRequest();
        char response[5];
        response[0] = 3;
        std::memcpy(&response[1], &id, sizeof(id));
        send(fd, response, 5, 0);
    }
    return;
}

void Server::handleAuthentication(std::string data, int fd)
{
    if (data.length() < 3)
    {
        return;
    }
    int userIDLen = (int)data[1];
    int passwordLen = (int)data[2];
    if (data.length() != (3 + userIDLen + passwordLen))
    {
        return;
    }
    std::string userId = data.substr(3, userIDLen);
    std::string password = data.substr(3 + userIDLen, passwordLen);
    data = Authentication::authenticateUser(userId, password);
    uint8_t flag = 9;
    std::vector<uint8_t> byteArray;
    byteArray.push_back(flag);
    byteArray.insert(byteArray.end(), data.begin(), data.end());
    send(fd, byteArray.data(), byteArray.size(), 0);
    return;
}

void Server::handleServiceListRequest(int fd)
{
    std::string serviceList = HealthMonitor::getServicesJSON();
    std::vector<uint8_t> byteArray;
    uint8_t flag = 11;
    byteArray.push_back(flag);
    byteArray.insert(byteArray.end(), serviceList.begin(), serviceList.end());
    send(fd, byteArray.data(), byteArray.size(), 0);
    return;
}

void Server::handleCPUStatusRequest(int fd)
{
    std::string cpuStatus = HealthMonitor::getCPUStatusJSON();
    std::vector<uint8_t> byteArray;
    uint8_t flag = 13;
    byteArray.push_back(flag);
    byteArray.insert(byteArray.end(), cpuStatus.begin(), cpuStatus.end());
    send(fd, byteArray.data(), byteArray.size(), 0);
    return;
}

void Server::handleInterfaceRequest(std::string buffer, int fd)
{
    if (buffer.length() < 2)
        return;
    uint8_t ID = static_cast<uint8_t>(buffer[1]);
    std::string data = Interface::getInterfaceListJSON();
    uint8_t flag = 19;
    std::vector<uint8_t> byteArray;
    byteArray.push_back(flag);
    byteArray.push_back(ID);
    byteArray.insert(byteArray.end(), data.begin(), data.end());
    send(fd, byteArray.data(), byteArray.size(), 0);
    return;
}

void Server::manageServiceRequest(std::string req)
{
    try
    {
        json obj = json::parse(req.substr(1));
        std::string service = obj.at("service");
        int operation = obj.at("operation");
        switch (operation)
        {
        case 0:
        {
            SystemdServiceManager::startService(service);
            break;
        }
        case 1:
        {
            SystemdServiceManager::stopService(service);
            break;
        }
        case 2:
        {
            SystemdServiceManager::restartService(service);
            break;
        }
        case 3:
        {
            SystemdServiceManager::enableService(service);
            break;
        }
        case 4:
        {
            SystemdServiceManager::disableService(service);
            break;
        }
        default:
            break;
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error during Service Management request handling " << e.what() << '\n';
    }
    return;
}

void Server::broadcastMessage(std::string &data, uint8_t flag)
{
    std::vector<uint8_t> byteArray;
    byteArray.push_back(flag);
    byteArray.insert(byteArray.end(), data.begin(), data.end());
    for (int fd : connectedFd)
    {
        send(fd, byteArray.data(), byteArray.size(), 0);
    }
}

void Server::continuousMonitoring()
{
    std::string data;
    int count = 0;
    std::map<std::string, std::vector<unsigned long>> prev_traffic = HealthMonitor::getNetworkStats();
    while (running)
    {
        switch (count)
        {
        case 0:
        {
            // RAM Status
            struct sysinfo ramStatus;
            int status = HealthMonitor::getRamStatus(&ramStatus);
            if (status == 0)
            {
                data = HealthMonitor::ramInfoJSON(ramStatus);
                broadcastMessage(data, 4);
            }
            break;
        }

        case 1:
        {
            // Disk Info
            std::vector<struct disk_info> allDisk = HealthMonitor::getAllMountedDisks();
            data = HealthMonitor::diskInfoJSON(allDisk);
            broadcastMessage(data, 5);
            break;
        }

        case 2:
        {
            // List of active Connections
            std::vector<connection_info> networkList = HealthMonitor::getNetworkConnections();
            data = HealthMonitor::networkListJSON(networkList);
            broadcastMessage(data, 7);
            break;
        }
        case 3:
        {
            data = HealthMonitor::getCPUStatusJSON();
            broadcastMessage(data, 13);
            break;
        }
        case 4:
        {
            std::this_thread::sleep_for(std::chrono::seconds(1));
            json data = json::array();
            std::map<std::string, std::vector<unsigned long>> curr_traffic = HealthMonitor::getNetworkStats();
            for (auto &p : curr_traffic)
            {
                data.push_back({{"interface", p.first},
                                {"RX", (double)((p.second)[0] - prev_traffic[p.first][0]) / 1024.0},
                                {"TX", (double)((p.second)[1] - prev_traffic[p.first][1]) / 1024.0}});
            }
            std::string message = data.dump();
            broadcastMessage(message, 6);
            prev_traffic = curr_traffic;
            break;
        }
        default:
        {
        }
        }
        count = (count + 1) % 4;
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }
}

void Server::watchNetworkTraffic()
{
    std::map<std::string, std::vector<unsigned long>> prev_traffic = HealthMonitor::getNetworkStats();
    while (running)
    {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        json data = json::array();
        std::map<std::string, std::vector<unsigned long>> curr_traffic = HealthMonitor::getNetworkStats();
        for (auto &p : curr_traffic)
        {
            data.push_back({{"interface", p.first},
                            {"RX", (double)((p.second)[0] - prev_traffic[p.first][0]) / 1024.0},
                            {"TX", (double)((p.second)[1] - prev_traffic[p.first][1]) / 1024.0}});
        }
        std::string message = data.dump();
        broadcastMessage(message, 6);
        prev_traffic = curr_traffic;
    }
}

void Server::WANSetup(std::string interface)
{
    Interface::changeWANInterface(interface);
}

Server::Server() : running(true)
{
    WANSetup(vpn.getPublicInterface());
    epollFd = epoll_create1(0);
    if (epollFd == -1)
    {
        perror("epoll_create1 failed");
        exit(EXIT_FAILURE);
    }

    serverSocketFd = createServerSocket();
    addToInputEventLoop(serverSocketFd);
    NodeServerThread = std::thread(&Server::startNodeServer, this, vpn.getIP());
    NodeServerThread.detach();
    fileScanThread = std::thread(&Server::handleBlockingRequest, this);
    // vpnRequestThread = std::thread(&Server::handleVPNRequest, this);
    healthMonitorThread = std::thread(&Server::continuousMonitoring, this);
    // networkTrafficThread = std::thread(&Server::watchNetworkTraffic, this);
    eventLoop();
}

Server::~Server()
{
    running = false;
    if (fileScanThread.joinable())
    {
        fileScanThread.join();
    }

    // if (vpnRequestThread.joinable())
    // {
    //     vpnRequestThread.join();
    // }

    if (healthMonitorThread.joinable())
    {
        healthMonitorThread.join();
    }

    // if (networkTrafficThread.joinable())
    // {
    //     networkTrafficThread.join();
    // }
}