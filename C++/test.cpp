#include "headers.h"

int main(){
    std::string service = "NetworkManager";
    SystemdServiceManager::startService(service);
}