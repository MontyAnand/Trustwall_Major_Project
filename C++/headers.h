#include <iostream>
#include <filesystem>
#include <array>
#include <cstring>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <map>
#include <unordered_set>
#include <queue>
#include <sstream>
#include <iomanip>
#include <vector>
#include <stdexcept>
#include <iterator>
#include <cassert>
#include <sys/statvfs.h>
#include <sys/sysinfo.h>
#include <cstdlib>
#include <string>
#include <chrono>
#include <cstdio>
#include <memory>

#include <nlohmann/json.hpp>

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
#include <pwd.h>
#include <shadow.h>
#include <crypt.h>
#include <dbus/dbus.h>

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

struct NetStats
{
    std::string iface;
    unsigned long rx_bytes, rx_packets, rx_errs, rx_drop, rx_fifo, rx_frame, rx_compressed, rx_multicast;
    unsigned long tx_bytes, tx_packets, tx_errs, tx_drop, tx_fifo, tx_colls, tx_carrier, tx_compressed;
};

struct interface_info
{
    std::string interface;
    float received_data;
    float transmitted_data;
};

struct disk_info
{
    std::string path;
    double percentageUsed;
};

struct connection_info
{
    std::string protocol;
    std::string local_ip;
    int local_port;
    std::string remote_ip;
    int remote_port;
    std::string state;
};

namespace fs = std::filesystem;
using json = nlohmann::json;

class QR
{
public:
    static void write_png(const char *, unsigned char *, int, int);
    static std::string file_to_base64(const std::string &);
    static std::string generate_qr_base64(const std::string &text, int scale = 10);
};

class VPN
{
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
    std::atomic<bool> running;

    std::map<std::string, std::uint16_t> record;

    std::string getPublicInterface();
    std::string getEndPoint();
    std::uint16_t getAvailableID();
    std::uint16_t generateClientConfiguration(std::string &, std::string &);
    std::string prepareIP(std::uint16_t);
    bool generateServerKeys();
    bool setupServer();
    bool generateConfigurationFile(std::string &);
    bool vpnInterfaceSetup();
    bool isNumber(std::string &);
    bool checkConnectivity();
    void revokeIP(std::uint16_t);
    void monitorClient();
    void parseString(std::string &, std::map<std::string, int> &);
    void generateQRCode(std::uint16_t, std::string &, std::string &);
    void addFirewallRules();

public:
    VPN();
    std::string getIP();
    std::uint16_t acceptConnectionRequest();
    ~VPN();
};

class Antivirus
{
public:
    static int startScanning(std::string);
    static bool searchFile(std::string);
};

class Authentication
{
public:
    static std::string authenticateUser(std::string &, std::string &);
    static std::string authResponseJSON(int, std::string, std::string &);
};

class HealthMonitor
{
public:
    static int getRamStatus(struct sysinfo *);
    static std::vector<struct interface_info> getNetworkTraffic();
    static std::vector<struct disk_info> getAllMountedDisks();
    static struct disk_info getDiskStatus(const char *);
    static std::vector<connection_info> getProtocolSpecificConnections(const std::string &, const std::string &);
    static std::vector<connection_info> getNetworkConnections();
    static std::string ramInfoJSON(struct sysinfo &);
    static std::string diskInfoJSON(std::vector<struct disk_info> &);
    static std::string networkTrafficJSON(std::vector<struct interface_info> &);
    static std::string networkListJSON(std::vector<connection_info> &networkList);
    static bool validService(std::string &);
    static std::string getServicesJSON();
    static std::string getCPUStatusJSON();
    static json parseMpstatOutput(const std::string &);
    static std::map<std::string, std::vector<unsigned long>> getNetworkStats();
};

class SystemdServiceManager
{
public:
    static bool sendMessage(const std::string &, const std::vector<std::string> &);
    static bool startService(const std::string &);
    static bool stopService(const std::string &);
    static bool restartService(const std::string &);
    static bool enableService(const std::string &);
    static bool disableService(const std::string &);
};

class Executor
{
public:
    static const int limit = 2048;
    static void executeCommand(std::string, int);
    static void executeScriptFile(std::string, int);
};

class Server
{
private:
    int serverSocketFd;
    int epollFd;

    std::queue<std::pair<int, char *>> antivirusQueue;
    std::queue<std::pair<int, char *>> vpnQueue;

    struct epoll_event events[MAX_EVENTS];

    std::thread NodeServerThread;
    std::thread fileScanThread;
    std::thread vpnRequestThread;
    std::thread healthMonitorThread;
    std::thread networkTrafficThread;

    std::mutex fileScanMTX;
    std::mutex vpnMTX;
    std::atomic<bool> running;

    std::unordered_set<int> connectedFd;

    VPN vpn;

    int createServerSocket();
    void broadcastMessage(std::string &, uint8_t);
    void eventLoop();
    void handleAuthentication(std::string, int);

    void setNonBlocking(int);
    void addToInputEventLoop(int);
    void addToOutputEventLoop(int);

    void startNodeServer(std::string);
    void processPacket(char *, int);
    void watchNetworkTraffic();

    void handleFilescan();
    void handleVPNRequest();
    void continuousMonitoring();
    void handleServiceListRequest(int);
    void handleCPUStatusRequest(int);
    void manageServiceRequest(std::string);

public:
    Server();
    ~Server();
};