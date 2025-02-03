#include "headers.h"

#define PORT 8080
#define BUFFER_SIZE 1024

int main() {
    int server_fd, client_fd;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);
    char buffer[BUFFER_SIZE] = {0};

    // 1️⃣ Create socket
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1) {
        perror("Socket creation failed");
        return EXIT_FAILURE;
    }

    // 2️⃣ Configure server address
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    // 3️⃣ Bind socket to the port
    if (bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) == -1) {
        perror("Bind failed");
        close(server_fd);
        return EXIT_FAILURE;
    }

    // 4️⃣ Listen for incoming connections
    if (listen(server_fd, 5) == -1) {
        perror("Listen failed");
        close(server_fd);
        return EXIT_FAILURE;
    }

    std::cout << "Server listening on port " << PORT << "...\n";

    // 5️⃣ Accept a client connection
    client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
    if (client_fd == -1) {
        perror("Accept failed");
        close(server_fd);
        return EXIT_FAILURE;
    }
    std::cout << "Client connected!\n";

    while(true){
        int bytes_received = read(client_fd,buffer,BUFFER_SIZE);
        if(bytes_received <=0)break;
        if(Antivirus::startScanning(buffer) != 1){
            std::string response = "file Not found";
            send(client_fd, response.c_str(), response.length(), 0);
            continue;
        }
        send(client_fd,buffer,bytes_received,0);
    }

    // Close connections
    close(client_fd);
    close(server_fd);
    return 0;
}
