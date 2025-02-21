#include "headers.h"

void Firewall::createTable()
{
    sprintf(command, "sudo nft add table inet %s", TABLE_NAME);
    int result = system(command);
    if (result == -1)
    {
        perror("Error during table creation...");
        exit(1);
    }
    return;
}

void Firewall::createPortSets()
{
    // Source PORT Set
    sprintf(command, "sudo nft add set inet %s %s '{type inet_service;}'", TABLE_NAME, SRC_PORT_SET);
    int result = system(command);
    if (result == -1)
    {
        perror("Error during creating Set...");
        exit(1);
    }

    // Destination PORT Set
    sprintf(command, "sudo nft add set inet %s %s '{type inet_service;}'", TABLE_NAME, DES_PORT_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Error during creating Set...");
        exit(1);
    }

    return;
}

void Firewall::createIPSets()
{
    // Source IP set
    sprintf(command, "sudo nft add set inet %s %s '{type ipv4_addr; flags interval;}'", TABLE_NAME, SRC_IP_SET);

    int result = system(command);
    if (result == -1)
    {
        perror("Error during creating set...");
        exit(1);
    }

    // Destination IP Set
    sprintf(command, "sudo nft add set inet %s %s '{type ipv4_addr; flags interval;}'", TABLE_NAME, DES_IP_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Error during ceating set...");
        exit(1);
    }
    return;
}

void Firewall::createChains()
{
    // Convention : Chain name is same as the Hook's name...

    int result;

    // Ingress Hook

    // Prerouting Hook

    sprintf(command, "sudo nft add chain inet %s prerouting '{type nat hook prerouting priority 0; policy accept;}'", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during creating chain...");
        exit(1);
    }

    // Input Hook

    sprintf(command, "sudo nft add chain inet %s input '{type filter hook input priority 0; policy accept;}'", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during creating chain...");
        exit(1);
    }

    // Forward Hook

    sprintf(command, "sudo nft add chain inet %s forward '{type filter hook forward priority 0; policy accept;}'", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during creating chain...");
        exit(1);
    }

    // Output Hook

    sprintf(command, "sudo nft add chain inet %s output '{type filter hook output priority 0; policy accept;}'", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during creating chain...");
        exit(1);
    }

    // Postrouting Hook

    sprintf(command, "sudo nft add chain inet %s postrouting '{type nat hook postrouting priority 0; policy accept;}'", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during creating chain...");
        exit(1);
    }

    return;
}

void Firewall::initialRules()
{
    int result;

    // Allowing Source Port from the set
    sprintf(command, "sudo nft add rule inet %s input tcp sport @%s drop", TABLE_NAME, SRC_PORT_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Error during Intial rule setup...");
        return;
    }

    // Allowing Destination Port from the set
    sprintf(command, "sudo nft add rule inet %s input tcp dport @%s drop", TABLE_NAME, DES_PORT_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Error during Intial rule setup...");
        return;
    }

    // Allowing Source IP Address from the set
    sprintf(command, "sudo nft add rule inet %s input ip saddr @%s drop", TABLE_NAME, SRC_IP_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Error during Intial rule setup...");
        return;
    }

    // Allowing Destination IP Address from the set
    sprintf(command, "sudo nft add rule inet %s input ip daddr @%s drop", TABLE_NAME, DES_IP_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Error during Intial rule setup...");
        return;
    }

    // Allowing Connection Tracking

    sprintf(command, "sudo nft add rule inet %s input ct state established, related accept", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during Initial rule setup...");
        return;
    }

    sprintf(command, "sudo nft add rule inet %s output ct state established, related accept", TABLE_NAME);
    result = system(command);
    if (result == -1)
    {
        perror("Error during Initial rule setup...");
        return;
    }

    // Adding Essential Ports and IP
    // sprintf(command, "sudo nft add element inet %s %s '{8080}'", TABLE_NAME, SRC_PORT_SET);
    // result = system(command);
    // if (result == -1)
    // {
    //     perror("Unable to allow the port...");
    //     return;
    // }

    // sprintf(command, "sudo nft add element inet %s %s '{8080}'", TABLE_NAME, DES_PORT_SET);
    // result = system(command);
    // if (result == -1)
    // {
    //     perror("Unable to allow the port...");
    //     return;
    // }

    // sprintf(command, "sudo nft add element inet %s %s '{127.0.0.1/32}'", TABLE_NAME, SRC_IP_SET);
    // result = system(command);
    // if (result == -1)
    // {
    //     perror("Unable to allow the port...");
    //     return;
    // }

    sprintf(command, "sudo nft add element inet %s %s '{127.0.0.1/32}'", TABLE_NAME, DES_IP_SET);
    result = system(command);
    if (result == -1)
    {
        perror("Unable to allow the port...");
        return;
    }

    return;
}
