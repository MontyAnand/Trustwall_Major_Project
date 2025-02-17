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
                    processPacket(buffer, fd);
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

void Server::processPacket(char *buffer, int fd)
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
    default:
        break;
    }
}

void Server::handleFilescan()
{
    int fd;
    std::string filename;
    char *buffer;
    while (running)
    {
        filename = "";
        {
            std::lock_guard<std::mutex> lock(fileScanMTX);
            if (antivirusQueue.empty())
                continue;
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
    std::string data = Authentication::authenticateUser(userId, password);
    uint8_t flag = 9;
    std::vector<uint8_t> byteArray;
    byteArray.push_back(flag);
    byteArray.insert(byteArray.end(), data.begin(), data.end());
    send(fd, byteArray.data(), byteArray.size(), 0);
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
            // Network Traffic on each Interface
            std::vector<struct interface_info> interfaces = HealthMonitor::getNetworkTraffic();
            data = HealthMonitor::networkTrafficJSON(interfaces);
            broadcastMessage(data, 6);
            break;
        }
        case 3:
        {
            // List of active Connections
            std::vector<connection_info> networkList = HealthMonitor::getNetworkConnections();
            data = HealthMonitor::networkListJSON(networkList);
            broadcastMessage(data, 7);
            break;
        }
        default:
        {
        }
        }
        count = (count + 1) % 4;
        std::this_thread::sleep_for(std::chrono::milliseconds(2000)); // 2 second delay
    }
}

Server::Server() : running(true)
{
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
    fileScanThread = std::thread(&Server::handleFilescan, this);
    vpnRequestThread = std::thread(&Server::handleVPNRequest, this);
    healthMonitorThread = std::thread(&Server::continuousMonitoring, this);
    eventLoop();
}

Server::~Server()
{
    running = false;
    if (fileScanThread.joinable())
    {
        fileScanThread.join();
    }

    if (vpnRequestThread.joinable())
    {
        vpnRequestThread.join();
    }

    if (healthMonitorThread.joinable())
    {
        healthMonitorThread.join();
    }
}