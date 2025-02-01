#include "headers.h"

int main(int argc, char* argv []){
    if(argc < 2){
        std::cerr << "Mention the filename\n";
        return 0;
    }
    if(Antivirus::startScanning(argv[1]) != 1){
        std::cerr << "Unable to scan\n";
        return 0;
    }

    std::cout << "Scan completed\n";

    return 0;
}