#include "headers.h"

int IPPool::getNetmask() {
    struct in_addr addr;
    if (inet_pton(AF_INET, netmask.c_str(), &addr) != 1) {
        std::cerr << "Invalid netmask!" << std::endl;
        return -1;
    }

    uint32_t mask = ntohl(addr.s_addr); // Convert to host byte order
    return std::bitset<32>(mask).count(); // Count number of 1s
}

uint32_t IPPool::ip_to_int(const std::string& ip) {
    struct in_addr addr;
    inet_pton(AF_INET, ip.c_str(), &addr);
    return ntohl(addr.s_addr);
}

std::string IPPool::int_to_ip(uint32_t ip) {
    struct in_addr addr;
    addr.s_addr = htonl(ip);
    char buf[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &addr, buf, INET_ADDRSTRLEN);
    return std::string(buf);
}

std::pair<int,std::string> IPPool::allocate_ip() {
    for (int i = 0; i < pool_size; ++i) {
        if (!bitmap[i]) {
            bitmap[i] = true;
            return std::make_pair(i,int_to_ip(network + 1 + i));
        }
    }
    return std::make_pair(-1,"");
}

void IPPool::release_ip(uint32_t ip_val) {
    if (ip_val <= network || ip_val >= broadcast) return;
    int index = ip_val - network - 1;
    if (index >= 0 && index < pool_size) {
        bitmap[index] = false;
    }
}

IPPool::IPPool(const std::string& base_ip, const std::string& netmask) {
    std::cout << base_ip << " " << netmask << "\n";
    this->netmask = netmask;
    uint32_t base = ip_to_int(base_ip);
    uint32_t mask = ip_to_int(netmask);
    network = base & mask;
    broadcast = network | ~mask;
    pool_size = broadcast - network - 1;
    bitmap.resize(pool_size, false);  // false = available
}
