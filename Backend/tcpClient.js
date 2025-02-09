const net = require('net');
const EventEmitter = require('events');
const { socketFileMap } = require('./utility/maps');
// const socketFileMap = new Map();
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
            console.log("data from C++ server");
            const responseType = data.readUint8(0);
            switch (responseType) {
                case 1: {
                    this.handleFilescanResult(data);
                    break;
                }
                case 3: {
                    this.handleVPVConnection(data);
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

    fileScan(filename,socketID) {
        console.log(`Socket ID before scanning : ${socketID}`);
        console.log("FIlename before scanning ",filename);
        // socketFileMap.set(filename,socketID);
        const filenameBuffer = Buffer.from(filename);
        const filenameSize = filename.length;
        const buffer = Buffer.alloc(2 + filenameSize);
        buffer.writeUInt8(0);
        buffer.writeUInt8(filenameSize, 1);
        filenameBuffer.copy(buffer, 2);
        this.client.write(buffer);
    }

    vpnConnectionRequest(socketId) {
        SocketQueue.enqueue(socketId);
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(2);
        this.client.write(buffer);
    }

    handleFilescanResult(data) {
        const filenameSize = data.readUInt8(1);
        const filename = data.slice(2, 2 + filenameSize).toString();
        const socketID = socketFileMap.get(filename);
        console.log(`Scan result for ${filename}`);
        const reportPath = path.join('./uploads', filename + ".report");
        const filePath = path.join('./uploads', filename);
        console.log(socketID);
        if (!socketID) {
            return;
        }
        socketFileMap.delete(filename);
        console.log(socketID);
        if (filenameSize === 0) {
            this.io.to(socketID).emit('scan-error', "Unable to scan the file");
            this.deleteFile(filePath);
            return;
        }
        const stream = fs.createReadStream(reportPath, { encoding: "utf8" });
        stream.on("data", chunk => {
            console.log(chunk);
            this.io.to(socketID).emit('scan-result', chunk);
        });

        stream.on("end", () => {
            this.io.to(socketID).emit('scan-completed');
            this.deleteFile(reportPath);
            this.deleteFile(filePath);
        });
        stream.on('error',(err)=>{
            console.log(`Error while reading report file : ${err}`);
        })
    }

    handleVPVConnection(data) {
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

    close() {
        this.client.end();
    }
}

