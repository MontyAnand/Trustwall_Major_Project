// #include "headers.h"
// #include <nlohmann/json.hpp>

// using json = nlohmann::json;

// void ramInfoJSON (struct sysinfo &status){
//     json data = {{"total" , (double)status.totalram / (1024*1024)},
//             {"free" , (double)status.freeram / (1024*1024) }
//     };

//     std::cout << "Ram data in JSON : \n" << data.dump() << "\n";
//     return;
// }

// void diskInfoJSON (std::vector<struct disk_info>& mountedDisk){
//     json data =json::array();
//     for(auto &info : mountedDisk){
//         data.push_back({
//             {"path", info.path},
//             {"total" , info.total_space},
//             {"free", info.free_space}
//         });
//     }

//     std::cout << "Disk Info in JSON : \n" << data.dump() << "\n";
//     return;
// }

// void networkTrafficJSON (std::vector<struct interface_info> &interfaces){
//     json data = json::array();
//     for(auto &interface : interfaces){
//         data.push_back({
//             {"interface",interface.interface},
//             {"received" , interface.received_data},
//             {"sent" , interface.transmitted_data}
//         });
//     }

//     std::cout << "Network Interface In JSON :\n" << data.dump() << "\n";
// }

// void networkListJSON(std::vector<connection_info>&networkList){
//     json data = json::array();
//     for(auto &connection : networkList){
//         data.push_back({
//             {"protocol", connection.protocol},
//             {"local_ip", connection.local_ip},
//             {"local_port", connection.local_port},
//             {"remote_ip", connection.remote_ip},
//             {"remote_port", connection.remote_port},
//             {"state", connection.state}
//         });
//     }

//     std::cout << "Network list in JSON :\n" << data.dump() << "\n";
//     return;
// }

// int main(){
//     // RAM Status
//     struct sysinfo ramStatus;

//     int status = HealthMonitor::getRamStatus(&ramStatus);
//     if(status ==0 ){
//         // std::cout << "Total Ram Space : " <<(double)ramStatus.totalram / (1024*1024) << std::endl;
//         // std::cout << "Free Ram Space : " << (double)ramStatus.freeram / (1024*1024) << std::endl;
//         ramInfoJSON(ramStatus);
//     }

//     else{
//         std::cout << "Unable to get Ram Status\n";
//     }

//     // Disk Status

//     std::cout << "Disk Status : \n";
//     std::vector<struct disk_info> allDisk = HealthMonitor::getAllMountedDisks();

//     diskInfoJSON(allDisk);

//     // Network Traffic on each Interface

//     std::vector<struct interface_info> interfaces = HealthMonitor::getNetworkTraffic();

//     std::cout << "Network Traffic for each Interface\n";

//     // for(auto &x: interfaces){
//     //     std::cout << "Interface : " << x.interface << " Received Data (KB) " << x.received_data << " Sent Data (KB) " << x.transmitted_data << std::endl;
//     // }

//     networkTrafficJSON(interfaces);

//     // List of active Connections

//     std::cout << "Connection list : \n";

//     std::vector<connection_info>networkList =  HealthMonitor::getNetworkConnections();

//     // for(auto& x: networkList){
//     //     std::cout << x.protocol << " " << x.local_ip << ":" << x.local_port << " " << x.remote_ip << ":" << x.remote_port << " " << x.state << std::endl;
//     // }

//     networkListJSON(networkList);

//     return 0;
// }