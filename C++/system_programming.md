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

Dependencies:
1. Wireguard
2. nlohmann-json3-dev
