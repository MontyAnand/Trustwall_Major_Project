#include <iostream>
#include <vector>
#include <string>
#include <arpa/inet.h>
#include <iostream>

class IPPool {
private:
    uint32_t network;
    uint32_t broadcast;
    int pool_size;
    std::vector<bool> bitmap;

    uint32_t ip_to_int(const std::string& ip) {
        struct in_addr addr;
        inet_pton(AF_INET, ip.c_str(), &addr);
        return ntohl(addr.s_addr);
    }

    std::string int_to_ip(uint32_t ip) {
        struct in_addr addr;
        addr.s_addr = htonl(ip);
        char buf[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &addr, buf, INET_ADDRSTRLEN);
        return std::string(buf);
    }

public:
    IPPool(const std::string& base_ip, const std::string& netmask) {
        uint32_t base = ip_to_int(base_ip);
        uint32_t mask = ip_to_int(netmask);
        network = base & mask;
        broadcast = network | ~mask;
        pool_size = broadcast - network - 1;
        bitmap.resize(pool_size, false);  // false = available
    }

    std::string allocate_ip() {
        for (int i = 0; i < pool_size; ++i) {
            if (!bitmap[i]) {
                bitmap[i] = true;
                return int_to_ip(network + 1 + i);
            }
        }
        return "No IPs available";
    }

    void release_ip(const std::string& ip) {
        uint32_t ip_val = ip_to_int(ip);
        if (ip_val <= network || ip_val >= broadcast) return;

        int index = ip_val - network - 1;
        if (index >= 0 && index < pool_size) {
            bitmap[index] = false;
        }
    }
};

int main(){
    std::string bip;
    std::string netmask;
    std::cout << "enter Base IP\n";
    std::cin>>bip;
    std::cout << "Rnter Netmask\n";
    std::cin >> netmask;
    IPPool x(bip,netmask);
    int z;
    while(true){
        std::cin >> z;
        if(z == 1){
            std::cout<<x.allocate_ip()<<"\n";
            continue;
        }
        if(z == 2){
            std::string ip;
            std::cin>>ip;
            x.release_ip(ip);
            continue;
        }
        break;
    }
}
