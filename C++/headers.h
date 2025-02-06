#include <iostream>
#include <filesystem>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/epoll.h>
#include <fcntl.h>


#define PORT 8080
#define BUFFER_SIZE 1024
#define TABLE_NAME "Remote_Access"
#define SRC_PORT_SET "src"
#define DES_PORT_SET "des"
#define SRC_IP_SET "sip"
#define DES_IP_SET "dip"
#define MAX_EVENTS 20


namespace fs = std::filesystem;

class Firewall {
    private:
        char command[150];
        struct epoll_event events[MAX_EVENTS];
        void createTable ();
        void createPortSets ();
        void createIPSets ();
        void createChains ();
        void initialRules ();

    public:
};


class Antivirus{
    public:
        static int startScanning (std::string);
        static bool searchFile (std::string);
};

class Server{
    private:
        int serverSocketFd;
        int epollFd;
        struct epoll_event events[MAX_EVENTS];
        void setNonBlocking(int);
        int createServerSocket();
        void addToInputEventLoop(int);
        void addToOutputEventLoop(int);
        void eventLoop();
    public:
        Server();
};