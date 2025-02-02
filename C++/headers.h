#include <iostream>
#include <filesystem>

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>


#define PORT 8080
#define BUFFER_SIZE 1024
#define TABLE_NAME "Remote_Access"
#define SRC_PORT_SET "src"
#define DES_PORT_SET "des"
#define SRC_IP_SET "sip"
#define DES_IP_SET "dip"


namespace fs = std::filesystem;

class Firewall {
    private:
        char command[150];

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