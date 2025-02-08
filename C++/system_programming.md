Documentation of System Programming

Protocols/Packet Format

Antivirus => | 1 Byte (Flag) | 1 byte (Size of filename filed size) | filename |

Antivirus request flag => 0
Antivirus response flag => 1

VPN request => | 1 byte (flag) | => flag = 2
VPN response => | 1 byte (flag) | 4 byte for ID | => 3
