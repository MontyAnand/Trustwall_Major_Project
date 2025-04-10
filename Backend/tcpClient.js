const net = require('net');
const EventEmitter = require('events');
const { socketFileMap, socketUserMap, ClientIDMap } = require('./utility/maps');
const { SocketQueue, serviceListQueue } = require('./utility/queue');
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
                case 9: {
                    this.handleAuthResponse(data);
                    break;
                }
                case 11: {
                    this.handleServiceListData(data);
                    break;
                }
                case 13: {
                    this.handleCPUData(data);
                    break;
                }
                case 16: {
                    this.handleCommandExecutionResult(data);
                    break;
                }
                case 19: {
                    this.handleInterfaceResult(data);
                    break;
                }
                case 21:  {
                    this.broadcastInterfaceACK();
                    break;
                }
                case 23: {
                    this.handleLANInterfaceDetails(data);
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

    authenticateUser(data) {
        const flag = 0x08;
        const userIdBuffer = Buffer.from(data.userId, 'utf-8');
        const passwordBuffer = Buffer.from(data.password, 'utf-8');
        const lenUserId = userIdBuffer.length;
        const lenPassword = passwordBuffer.length;
        const buffer = Buffer.concat([
            Buffer.from([flag]),               // 1st byte: Flag
            Buffer.from([lenUserId]),          // 2nd byte: Length of userId
            Buffer.from([lenPassword]),        // 3rd byte: Length of password
            userIdBuffer,                      // UserId as bytes
            passwordBuffer                      // Password as bytes
        ]);
        this.client.write(buffer);
    }

    vpnConnectionRequest(socketId) {
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(2);
        this.client.write(buffer);
    }

    ramInfoRequest(){
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(4);
        this.client.write(buffer);
    }

    diskInfoRequest(){
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(5);
        this.client.write(buffer);
    }

    connectionListRequest(){
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(7);
        this.client.write(buffer);
    }

    cpuInfoRequest(){
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(12);
        this.client.write(buffer);
    }

    serviceListRequest() {
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(10);
        this.client.write(buffer);
    }

    serviceManagementRquest(data) {
        const jsonString = JSON.stringify(data);
        const jsonBuffer = Buffer.from(jsonString, 'utf-8');
        const buffer = Buffer.concat([Buffer.from([14]), jsonBuffer]);
        this.client.write(buffer);
    }

    sendLANDetailsRequest(){
        const buffer = Buffer.from([22]);
        this.client.write(buffer);
    }

    sendNetworkTrafficRequest(){
        const buffer = Buffer.from([6]);
        this.client.write(buffer);
    }

    executeCommand(data, socketID) {
        const index = ClientIDMap.indexOf(socketID);
        const length = data.length;
        // console.log(length);
        const commandBuffer = Buffer.from(data, 'utf-8');
        const indexBuffer = Buffer.from([index & 0xFF]);
        const lengthBuffer = Buffer.from([length & 0xFF]);
        const buffer = Buffer.concat([Buffer.from([15]), indexBuffer, lengthBuffer, commandBuffer]);
        // console.log(buffer.toString());
        this.client.write(buffer);
    }

    interfaceListRequest(socketID) {
        const index = ClientIDMap.indexOf(socketID);
        const indexBuffer = Buffer.from([index & 0xFF]);
        const buffer = Buffer.concat([Buffer.from([18]), indexBuffer]);
        this.client.write(buffer);
    }

    changeInterfaceConfiguration(data) {
        if (!data.if || !data.ip || !data.netmask || data.type  == null) {
            console.log("Invalid Data");
            return;
        }

        try {
            const interfaceNameLength = Buffer.byteLength(data.if);
            const bufferSize = 8 + interfaceNameLength; // Corrected calculation
            const buffer = Buffer.alloc(bufferSize);
            buffer.writeUInt8(20, 0); // First byte (flag)
            buffer.writeUInt8(data.type, 1); // Second byte (interface type)
            buffer.writeUInt8(data.netmask, 2); // Correct field access
            buffer.writeUInt32BE(data.ip >>> 0, 3); // Ensure IP is unsigned
            buffer.writeUInt8(interfaceNameLength, 7); // Interface name length
            buffer.write(data.if, 8, interfaceNameLength, "utf8"); // Interface name
            this.client.write(buffer);
        } catch (error) {
            console.log("Error in Interface Configuration: ", error);
        }
    }


    handleCommandExecutionResult(data) {
        const index = data.readUInt8(1);
        const socketID = ClientIDMap[index];
        const result = data.slice(2, data.length).toString();
        this.io.to(socketID).emit('command-execution-result', result);
    }

    handleInterfaceResult(data) {
        const index = data.readUInt8(1);
        const socketID = ClientIDMap[index];
        const result = data.slice(2, data.length).toString();
        try {
            const jsonData = JSON.parse(result);
            this.io.to(socketID).emit('interface-list', jsonData);
            this.emit('interface-list',jsonData);
        } catch (error) {
            // console.log("Interface : ", error);
        }
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

    handleLANInterfaceDetails(data){
        const jsonString = data.subarray(1).toString('utf-8');
        try{
            const jsonData = JSON.parse(jsonString);
            this.emit('lan-interface-details',jsonData);
        }catch(error){
            this.emit('lan-interface-details',{'error':error});
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
            const percentageUsage = ((jsonData.total - jsonData.free) / jsonData.total) * 100;
            // console.log(`Ram: data : ${percentageUsage}`);
            // this.io.emit('ram-info', percentageUsage);
        } catch (error) {
            // console.log(`Error in RAM data`);
            // console.error('Error parsing JSON:', error);
            // this.ramInfoRequest();
        }
    }

    processDiskData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            // Parse JSON string into an object
            const jsonData = JSON.parse(jsonString);
            // console.log(`Disk Data: ${jsonData}`);
            this.io.emit('disk-info', jsonData);
        } catch (error) {
            console.log(`Error in Disk data`);
            // console.error('Error parsing JSON:', error);
            // this.diskInfoRequest();
        }
    }

    processNetworkTrafficData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            // Parse JSON string into an object
            const jsonData = JSON.parse(jsonString);
            // console.log('Received JSON:', jsonData);
            this.io.emit('network-traffic', jsonData);
        } catch (error) {
            // console.log(`Error in Network data`);
            // console.error('Error parsing JSON:', error);
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
            // console.log(`Error in Connection list data`);
            // console.error('Error parsing JSON:', error);
            // this.connectionListRequest();
        }
    }

    handleAuthResponse(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            const jsonData = JSON.parse(jsonString);
            const socketId = socketUserMap.get(jsonData.userId);
            if (!socketId) {
                return;
            }
            this.io.to(socketId).emit('auth-result', jsonData);
            socketUserMap.delete(jsonData.userId);
        } catch (error) {
            // console.log(`Auth error : ${error}`);
        }
    }

    handleServiceListData(data) {
        if (serviceListQueue.isEmpty()) {
            return;
        }
        const socketID = serviceListQueue.dequeue();
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            const jsonData = JSON.parse(jsonString);
            this.io.to(socketID).emit('service-list', jsonData);

        } catch (error) {
            // console.log(`Service List Error :  ${error}`);
        }
    }

    handleCPUData(data) {
        const jsonString = data.subarray(1).toString('utf-8');
        try {
            const jsonData = JSON.parse(jsonString);
            this.io.emit('cpu-data', jsonData);
        } catch (error) {
            // console.log(`Service List Error :  ${error}`);
        }
    }

    broadcastInterfaceACK(){
        this.io.emit('interface-ack');
    }

    close() {
        this.client.end();
    }
}

