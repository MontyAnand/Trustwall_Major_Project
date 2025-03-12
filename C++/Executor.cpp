#include "headers.h"

// Packet structure for sending data
struct Packet
{
    uint8_t flag;          // Identifier flag
    uint8_t ID;            // Unique ID of request
    char data[128];        // Buffer for command output
} __attribute__((packed)); // Ensures no extra padding

void Executor::executeCommand(std::string data, int fd)
{
    try
    {
        // Validate command length
        if (data.length() < 3)
            return;

        uint8_t ID = static_cast<uint8_t>(data[1]);
        int len = static_cast<int>(data[2]);

        if (data.length() != (3 + len))
            return;

        // Open the command process
        FILE *pipe = popen(("cd / && " + data.substr(3) + " 2>&1").c_str(), "r");
        if (!pipe)
        {
            std::cerr << "Error: popen failed!" << std::endl;
            return;
        }

        int byteCount = 0;
        uint8_t flag = 16;
        char word[128];
        int index = 0;
        char ch;

        while ((ch = fgetc(pipe)) != EOF)
        {
            if (ch == ' ' || ch == '\n') // Word boundary
            {
                if (index > 0) // Send accumulated word
                {
                    word[index] = '\0'; // Null-terminate word
                    Packet packet;
                    packet.flag = flag;
                    packet.ID = ID;
                    memset(packet.data, 0, sizeof(packet.data));
                    memcpy(packet.data, word, index);
                    send(fd, &packet, offsetof(Packet, data) + index, 0);
                    byteCount += index;
                    index = 0; // Reset index for next word
                }

                // Send space separately
                if (ch == ' ')
                {
                    Packet spacePacket;
                    spacePacket.flag = flag;
                    spacePacket.ID = ID;
                    memset(spacePacket.data, 0, sizeof(spacePacket.data));
                    spacePacket.data[0] = ' ';
                    send(fd, &spacePacket, offsetof(Packet, data) + 1, 0);
                    byteCount++;
                }
                // Send newline as "\r\n"
                else if (ch == '\n')
                {
                    Packet newlinePacket;
                    newlinePacket.flag = flag;
                    newlinePacket.ID = ID;
                    memset(newlinePacket.data, 0, sizeof(newlinePacket.data));
                    strcpy(newlinePacket.data, "\r\n");
                    send(fd, &newlinePacket, offsetof(Packet, data) + 2, 0);
                    byteCount += 2;
                }

                if (byteCount >=  Executor::limit)
                    break;
            }
            else
            {
                if (index < sizeof(word) - 1) // Accumulate word
                {
                    word[index++] = ch;
                }
            }
        }

        // Send any remaining word
        if (index > 0)
        {
            word[index] = '\0';
            Packet packet;
            packet.flag = flag;
            packet.ID = ID;
            memset(packet.data, 0, sizeof(packet.data));
            memcpy(packet.data, word, index);
            send(fd, &packet, offsetof(Packet, data) + index, 0);
        }

        pclose(pipe); // Close the pipe

        // Send End marker
        Packet packet;
        packet.flag = flag;
        packet.ID = ID;
        memset(packet.data, 0, sizeof(packet.data));
        strcpy(packet.data, "\r\nEnd\r\n>  ");
        send(fd, &packet, offsetof(Packet, data) + 9, 0);
    }
    catch (const std::exception &e)
    {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
}


void Executor::executeScriptFile(std::string data, int fd){
    return ;
}