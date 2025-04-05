#include "headers.h"

void Firewall::flushChain(std::string table, std::string chain)
{
    std::string command = "sudo nft flush chain " + table + " " + chain;
    system(command.c_str());
    return;
}

void Firewall::allowInterfaceForwarding(std::string LAN, std::string WAN)
{
    // Flushing the initial rules for farwarding
    flushChain("SYSTEM_TABLE", "INTERFACE_FORWARDING");

    // Allow lan to wan forwading
    std::string command = "sudo nft add rule inet SYSTEM_TABLE INTERFACE_FORWARDING iifname \"" + LAN + "\" oifname \"" + WAN + "\" accept";
    std::cout << command << std::endl;
    system(command.c_str());

    // Allow lan to wan forwading
    command = "sudo nft add rule inet SYSTEM_TABLE INTERFACE_FORWARDING iifname \"" + WAN + "\" oifname \"" + LAN + "\" accept";
    std::cout << command << std::endl;
    system(command.c_str());
    return;
}

void Firewall::allowMasquerading(std::string interface)
{
    // Flush existing rule
    flushChain("SYSTEM_TABLE", "MASQUERADING");

    // Adding Masquerading rule to given Interface
    std::string command = "sudo nft add rule inet SYSTEM_TABLE MASQUERADING oifname \"" + interface + "\" masquerade";
    system(command.c_str());
    return;
}