const net = require('net');

const SERVER_IP = "127.0.0.1";
const SERVER_PORT = 8080;


const client = new net.Socket();
client.on('data', (data)=>{
    console.log(data.toString());
});

const Antivirus_request = (filename)=>{
    console.log(filename);
    const filenameBuffer = Buffer.from(filename);
    const filenameSize = filename.length;
    const buffer = Buffer.alloc(2+filenameSize);
    buffer.writeUInt8(0);
    buffer.writeUInt8(filenameSize,1);
    filenameBuffer.copy(buffer,2);
    console.log(buffer.toString());
    client.write(buffer);
}


client.connect(SERVER_PORT, SERVER_IP, () => {
    console.log("Connected to server");
});

Antivirus_request("Hello World");
