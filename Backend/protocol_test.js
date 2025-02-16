const net = require('net');

const SERVER_IP = "127.0.0.1";
const SERVER_PORT = 8080;

const client = new net.Socket();
client.on('data', (data) => {
    const responseType = data.readUint8(0);
    if (responseType == 1) {
        const filenameSize = data.readUInt8(1);
        if (filenameSize == 0) {
            console.log("Unable to scan the file");
        }
        else {
            const filename = data.slice(2, 2 + filenameSize).toString();
            console.log(filename);
        }
    }
    else if (responseType == 3) {
        const ID = data.readInt32LE(1);
        if (ID == 0) {
            console.log("Unable to establish the VPN connection");
        }
        else {
            console.log(`ID : ${ID}`);
        }
    }
});

const Antivirus_request = (filename) => {
    console.log(filename);
    const filenameBuffer = Buffer.from(filename);
    const filenameSize = filename.length;
    const buffer = Buffer.alloc(2 + filenameSize);
    buffer.writeUInt8(0);
    buffer.writeUInt8(filenameSize, 1);
    filenameBuffer.copy(buffer, 2);
    console.log(buffer.toString());
    client.write(buffer);
}

const vpn = () => {
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(2);
    client.write(buffer);
}


client.connect(SERVER_PORT, SERVER_IP, () => {
    console.log("Connected to server");
});

Antivirus_request("1738654701280.png");
vpn();
