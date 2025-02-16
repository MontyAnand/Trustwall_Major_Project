const net = require('net');
const EventEmitter = require('events');
const { socketFileMap } = require('./utility/maps');
const { SocketQueue } = require('./utility/queue');
const path = require('path');
const fs = require('fs');

module.exports.client = class TcpClient extends EventEmitter {
    constructor(serverIp, serverPort, io) {
        super();
        this.client = new net.Socket();
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.io = io;

        this.client.connect(this.serverPort, this.serverIp, () => {
            console.log(`Connected to server at ${this.serverIp}:${this.serverPort}`);
            this.emit('connected'); // Emit 'connected' event
        });

        this.client.on('data', (data) => {
            const responseType = data.readUint8(0);
            switch (responseType) {
                case 1: {
                    this.handleFilescanResult(data);
                    break;
                }
                case 3: {
                    this.handleVPNConnection(data);
                    break;
                }
                case 4: {
                    this.processRAMData(data);
                    break;
                }
                case 5: {
                    this.processDiskData(data);
                    break;
                }
                case 6: {
                    this.processNetworkTrafficData(data);
                    break;
                }
                case 7: {
                    this.processConnectionListData(data);
                    break;
                }
                default: break;
            }
        });

        this.client.on('close', () => {
            console.log('Connection closed');
            this.emit('close');
        });

        this.client.on('error', (err) => {
            console.error(`Error: ${err.message}`);
            this.emit('error', err);
        });
    }

    fileScan(filename) {
        const filenameBuffer = Buffer.from(filename);
        const filenameSize = filename.length;
        const buffer = Buffer.alloc(2 + filenameSize);
        buffer.writeUInt8(0);
        buffer.writeUInt8(filenameSize, 1);
        filenameBuffer.copy(buffer, 2);
        this.client.write(buffer);
    }

    vpnConnectionRequest(socketId) {
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(2);
        this.client.write(buffer);
    }

    handleFilescanResult(data) {
        const filenameSize = data.readUInt8(1);
        const filename = data.slice(2, 2 + filenameSize).toString();
        const socketID = socketFileMap.get(filename);
        const reportPath = path.join('./uploads', filename + ".report");
        const filePath = path.join('./uploads', filename);
        if (!socketID) {
            return;
        }
        socketFileMap.delete(filename);
        if (filenameSize === 0) {
            this.io.to(socketID).emit('scan-error', "Unable to scan the file");
            this.deleteFile(filePath);
            return;
        }
        const stream = fs.createReadStream(reportPath, { encoding: "utf8" });
        stream.on("data", chunk => {
            this.io.to(socketID).emit('scan-result', chunk);
        });

        stream.on("end", () => {
            this.io.to(socketID).emit('scan-completed');
            this.deleteFile(reportPath);
            this.deleteFile(filePath);
        });
        stream.on('error', (err) => {
            console.log(`Error while reading report file : ${err}`);
        })
    }

    handleVPNConnection(data) {
        const ID = data.readInt32LE(1);
        if (SocketQueue.isEmpty()) {
            return;
        }
        const socketID = SocketQueue.dequeue();
        if (ID == 0) {
            this.io.to(socketID).emit('vpn-connection-error', "Unable to establish the connection");
            return;
        }
        else {
            const qrFilepath = path.join('../C++', `${ID}.qr`);
            const stream = fs.createReadStream(qrFilepath, { encoding: "utf8" });
            stream.on("data", chunk => {
                this.io.to(socketID).emit('vpn-data', chunk);
            });
            stream.on("end", () => {
                this.io.to(socketID).emit('vpn-data-completed');
            });
        }
    }

    deleteFile(filePath) {
        console.log(`Delete request for ${filePath}`);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Unable to delete file : ${err}`);
            }
            else {
                console.log("Successfully deleted the file : ", filePath);
            }
        });
    }

    processRAMData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            // Parse JSON string into an object
            const jsonData = JSON.parse(jsonString);
            console.log('Received JSON:', jsonData);
            const percentageUsage = ((jsonData.total - jsonData.free) / jsonData.total) * 100;
            this.io.emit('ram-info', percentageUsage);
        } catch (error) {
            console.log(`Error in RAM data`);
            console.error('Error parsing JSON:', error);
        }
    }

    processDiskData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            // Parse JSON string into an object
            const jsonData = JSON.parse(jsonString);
            console.log('Received JSON:', jsonData);
            this.io.emit('disk-info', jsonData);
        } catch (error) {
            console.log(`Error in Disk data`);
            console.error('Error parsing JSON:', error);
        }
    }

    processNetworkTrafficData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            // Parse JSON string into an object
            const jsonData = JSON.parse(jsonString);
            // console.log('Received JSON:', jsonData);
        } catch (error) {
            console.log(`Error in Network data`);
            console.error('Error parsing JSON:', error);
        }
    }

    processConnectionListData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            // Parse JSON string into an object
            const jsonData = JSON.parse(jsonString);
            this.io.emit('connection-list', jsonData);
            // console.log('Received JSON:', jsonData);
        } catch (error) {
            console.log(`Error in Connection list data`);
            console.error('Error parsing JSON:', error);
        }
    }

    close() {
        this.client.end();
    }
}

