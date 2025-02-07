#include <iostream>
#include <filesystem>
#include <array>
#include <cstring>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <map>
#include <sstream>
#include <iomanip>
#include <vector>
#include <stdexcept>
#include <iterator>
#include <cassert>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/epoll.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <net/if.h>
#include <qrencode.h>
#include <png.h>


#include <thread>
#include <mutex>
#include <chrono>
#include <atomic>


#define SERVER_PORT 8080
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

class QR {
    public:
        static void write_png(const char *, unsigned char *, int , int);
        static std::string file_to_base64(const std::string &);
        static std::string generate_qr_base64(const std::string &text, int scale = 10);
};

class VPN {
    private:
        int TIMEOUT_PERIOD;
        std::string publicInterface;
        std::string endPoint;
        std::string publicIP;
        std::string server_public_key;
        std::uint64_t ip_pool;
        std::uint16_t PORT;
        std::string netmask;

        std::mutex mtx;
        std::thread cleaner;
        std::atomic <bool> running;

        std::map<std::string,std::uint16_t>record;

        std::string getPublicInterface();
        std::string getEndPoint();
        std::string compressData (std::string &);
        std::uint16_t getAvailableID();
        std::uint16_t generateClientConfiguration(std::string&, std::string&);
        std::string prepareIP(std::uint16_t);
        bool generateServerKeys();
        bool setupServer();
        bool generateConfigurationFile(std::string&);
        bool vpnInterfaceSetup();
        bool isNumber(std::string &);
        bool checkConnectivity();
        void revokeIP(std::uint16_t);
        void monitorClient();
        void parseString(std::string &, std::map<std::string,int> &);
        void generateQRCode(std::uint16_t, std::string&, std::string&);
        void addFirewallRules();
        

    public:
        VPN();
        void printData();
        std::string getIP();
        std::uint16_t acceptConnectionRequest();
        ~VPN ();
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