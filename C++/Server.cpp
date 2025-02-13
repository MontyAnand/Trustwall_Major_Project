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
                    epoll_ctl(epollFd, EPOLL_CTL_DEL, fd, nullptr);
                    close(fd);
                }
                else
                {
                    processPacket(buffer,fd);
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

void Server::startNodeServer(std::string IP){
    std::string command = "cd ../Backend && node index.js "+IP;
    system(command.c_str());
}

void Server::processPacket (char* buffer, int fd){
    int flag = (int)(char)buffer[0];
    switch (flag) {
        case 0: {
            {
                std::lock_guard <std::mutex> lock(fileScanMTX);
                antivirusQueue.push(std::make_pair(fd,buffer));
            }
            break;
        }
        case 2: {
            {
                std::lock_guard <std::mutex> lock(vpnMTX);
                vpnQueue.push(std::make_pair(fd,buffer));
            }
            break;
        }
    }
}


void Server::handleFilescan(){
    int fd;
    std::string filename;
    char* buffer;
    while(running){
        filename = "";
        {
            std::lock_guard <std::mutex> lock(fileScanMTX);
            if(antivirusQueue.empty())continue;
            auto p = antivirusQueue.front();
            antivirusQueue.pop();
            fd = p.first;
            buffer = p.second;
        }
        int size = (int)buffer[1];
        for(int i=0;i<size;i++){
            filename = filename + buffer[2+i];
        }
        std::cout << "Antivirus request : " << filename << "\n";
        if(Antivirus::startScanning(filename) != 1){
            size = 0;
        }
        char response[2+filename.length()];
        response[0] = 1;
        response[1] = size;
        for(int i=0;i<filename.length();i++){
            response[i+2] = filename[i];
        }
        send(fd,response, sizeof(response),0);
    }
}

void Server::handleVPNRequest(){
    int fd;
    char* buffer;
    while(running){
        {
            std::lock_guard <std::mutex> lock(vpnMTX);
            if(vpnQueue.empty())continue;
            auto p = vpnQueue.front();
            vpnQueue.pop();
            fd = p.first;
            buffer = p.second;
        }
        int id = vpn.acceptConnectionRequest();
        char response[5];
        response[0] = 3;
        std::memcpy(&response[1],&id, sizeof(id));
        send(fd,response,5,0);
    }
    return;
}

void Server::broadcastMessage(std::string &data){
    for(int fd: connectedFd){
        send(fd,data.c_str(), data.length(), 0);
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
    vpnRequestThread = std::thread(&Server::handleVPNRequest,this);
    eventLoop();
}

Server::~Server(){
    running = false;
    if(fileScanThread.joinable()){
        fileScanThread.join();
    }

    if(vpnRequestThread.joinable()){
        vpnRequestThread.join();
    }
}