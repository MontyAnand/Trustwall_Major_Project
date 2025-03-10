#include "headers.h"

// Packet structure for sending data
struct Packet {
    uint8_t flag;        // Identifier flag
    uint8_t ID;          // Unique ID of request
    char data[128];      // Buffer for command output
} __attribute__((packed)); // Ensures no extra padding

void Executor::executeCommand(std::string data, int fd) {
    try {
        // Validate command length
        if (data.length() < 3) return;

        uint8_t ID = static_cast<uint8_t>(data[1]);
        int len = static_cast<int>(data[2]);

        if (data.length() != (3 + len)) return;

        // Open the command process
        FILE *pipe = popen((data.substr(3)).c_str(), "r");
        if (!pipe) {
            std::cerr << "Error: popen failed!" << std::endl;
            return;
        }

        uint8_t flag = 16;
        char buffer[128];

        // Read command output in chunks
        while (fgets(buffer, sizeof(buffer) - 1, pipe) != nullptr) {
            size_t bytesRead = strlen(buffer);  // Get actual data length

            // Prepare packet
            Packet packet;
            packet.flag = flag;
            packet.ID = ID;
            memset(packet.data, 0, sizeof(packet.data)); // Clear buffer
            memcpy(packet.data, buffer, bytesRead); // Copy only valid data

            // Send data to the client
            send(fd, &packet, offsetof(Packet, data) + bytesRead, 0);
        }

        pclose(pipe);  // Close the pipe
    } catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }
}
