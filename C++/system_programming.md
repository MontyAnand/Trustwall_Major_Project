Documentation of System Programming

Protocols/Packet Format

Antivirus => | 1 Byte (Flag) | 1 byte (Size of filename filed size) | filename |

Antivirus request flag => 0
Antivirus response flag => 1

VPN request => | 1 byte (flag) | => flag = 2
VPN response => | 1 byte (flag) | 4 byte for ID | => flag = 3

RAM status => |1 byte (flag)| JSON DATA | => flag = 4
DISK status => |1 byte (flag) | JSON ARRAY DATA | => flag = 5
NETWORK TRAFFIC => |1 byte (flag) | JSON ARRAY DATA | => flag = 6
Connection LIST => |1 byte (flag) | JSON ARRAY DATA | => flag = 7

Authentication Request => |1 byte (flag) |1 byte (UserId Length) |1 byte (Password Length) | UserId |Password | => flag = 8
Authentication Response => |1 byte (flag)| JSON DATA | => flag = 9

Service List Request => |1 byte (flag) | => flag = 10
Service List Response => |1 byte (flag) | JSON Array | => flag = 11

CPU Status Request => |1 byte (flag) | => flag = 12
CPU Status Response => |1 byte (flag) | JSON DATA | => flag = 13

Service Management Request => |1 byte (flag) | JSON DATA | => flag = 14
JSON DATA => |service name|operation| => operation: {0:start,1:stop,2:restart,3:enable,4:disable}

Command Execution Request => |1 byte (flag) |1 byte (Client ID) |1 byte (length of the command) | Command | => flag = 15

comand Execution Response => |1 byte (flag)|1 byte (Client ID)| Response | => flag = 16

Interface Request => |1 byte (flag)| 1 byte (Client ID)| => flag = 18

Interface Response => |1 byte (flag)| 1 Byte (Client ID)| Response JSON | => flag = 19

Dependencies:
1. Wireguard
2. nlohmann-json3-dev
3. libcrypt-dev
4. libqrencode-dev
5. libpng-dev
6. nodejs
7. npm
8. sysstat