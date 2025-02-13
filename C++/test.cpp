#include "headers.h"

int main(){
    // RAM Status
    struct sysinfo ramStatus;

    int status = HealthMonitor::getRamStatus(&ramStatus);
    if(status ==0 ){
        std::cout << "Total Ram Space : " <<(double)ramStatus.totalram / (1024*1024) << std::endl;
        std::cout << "Free Ram Space : " << (double)ramStatus.freeram / (1024*1024) << std::endl;
    }

    else{
        std::cout << "Unable to get Ram Status\n";
    }

    // Disk Status

    std::cout << "Disk Status : \n";
    std::vector<struct disk_info> allDisk = HealthMonitor::getAllMountedDisks();

    for(auto &x: allDisk){
        std::cout << "Path : " << x.path << " Total space : " << x.total_space << " Free space : " << x.free_space << std::endl;
    }

    // Network Traffic on each Interface

    std::vector<struct interface_info> interfaces = HealthMonitor::getNetworkTraffic();

    std::cout << "Network Traffic for each Interface\n";

    for(auto &x: interfaces){
        std::cout << "Interface : " << x.interface << " Received Data (KB) " << x.received_data << " Sent Data (KB) " << x.transmitted_data << std::endl;
    }

    // List of active Connections

    std::cout << "Connection list : \n";

    std::vector<connection_info>networkList =  HealthMonitor::getNetworkConnections();

    for(auto& x: networkList){
        std::cout << x.protocol << " " << x.local_ip << ":" << x.local_port << " " << x.remote_ip << ":" << x.remote_port << " " << x.state << std::endl;
    }

    return 0;
}