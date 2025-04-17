const express = require('express');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { socketFileMap, socketUserMap, ClientIDMap } = require('./utility/maps');
const { SocketQueue, serviceListQueue } = require('./utility/queue');
const { client } = require('./tcpClient');
const cron = require('node-cron');
const yaml = require('js-yaml');
const suricataRoute = require('./Routes/suricata');
const dhcpRoute = require('./Routes/dhcp');
const firewall_forward_routes = require('./Routes/firewall_forward');
const firewall_set_routes = require('./Routes/firewall_set');
const firewall_mac_routes = require('./Routes/firewall_mac_rule');
const firewall_custom_rule_routes = require('./Routes/firewall_custom_rule');
const Counter = require('./utility/counter');
const newCounter = new Counter(5);
const app = express();
const port = 5000;
const HOST = process.argv[2];
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const tcpClient = new client('127.0.0.1', 8080, io);

io.on('connection', (socket) => {
    console.log(`Client is conneced with socketID ${socket.id}`);
    ClientIDMap.push(socket.id);
    socket.emit('connection', "SuccessFully connected with server");
    socket.on('newVPNConnection', () => {
        SocketQueue.enqueue(socket.id);
        tcpClient.vpnConnectionRequest();
    });
    socket.on('authenticate-user', (data) => {
        socketUserMap.set(data.userId, socket.id);
        tcpClient.authenticateUser(data);
    });
    socket.on('service-list-request', () => {
        serviceListQueue.enqueue(socket.id);
        tcpClient.serviceListRequest();
    });
    socket.on('update-service-status', (data) => {
        tcpClient.serviceManagementRquest(data);
    });
    socket.on('execute-command', (data) => {
        tcpClient.executeCommand(data, socket.id);
    });
    socket.on('interface-list-request', () => {
        tcpClient.interfaceListRequest(socket.id);
    });
    socket.on('change-interface-configuration', (data) => {
        tcpClient.changeInterfaceConfiguration(data);
    });
    socket.on('getRAMInfo', ()=>{
        tcpClient.ramInfoRequest();
    });
    socket.on('getDiskInfo',()=>{
        tcpClient.diskInfoRequest();
    });
    socket.on('getConnectionList',()=>{
        tcpClient.connectionListRequest();
    });
    socket.on('getCPUInfo',()=>{
        tcpClient.cpuInfoRequest();
    });
});

cron.schedule('*/2 * * * * *',()=>{
    tcpClient.sendNetworkTrafficRequest();
});

cron.schedule('*/5 * * * * *',()=>{
    switch(newCounter.increment()){
        case 0: {
            tcpClient.diskInfoRequest();
            break;
        }
        case 1: {
            tcpClient.ramInfoRequest();
            break;
        }
        case 2: {
            tcpClient.connectionListRequest();
            break;
        }
        case 3:{
            tcpClient.cpuInfoRequest();
            break;
        }
        case 4:{
            tcpClient.interfaceListRequest();
            break;
        }
    }
});

app.use(express.json());
app.use(cors({
    origin: '*',
}));

// const socketFileMap = new Map();

const getFilename = (req, res, next) => {
    const socketID = req.body.socketID;
    const filename = req.file.filename;
    if (!socketID || !filename) {
        res.status(400).send("Unable to scan the file!!!");
        return;
    }
    socketFileMap.set(filename, socketID);
    tcpClient.fileScan(filename);
    next();
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send("Server is running");
})

// File upload endpoint
app.post('/upload', upload.single('file'), getFilename, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', file: req.file.filename });
});

app.get('/lanInfo', (req, res) => {
    tcpClient.sendLANDetailsRequest();
    tcpClient.once('lan-interface-details', (data) => {
        res.status(200).send(data);
    });
});


app.get('/interfaces',(req,res)=>{
    tcpClient.interfaceListRequest("null");
    tcpClient.once('interface-list',(data)=>{
        res.status(200).send(data);
    });
});

app.post('/vpnServerSetup', (req,res)=>{
    tcpClient.vpnServerSetupRequest(req.body);
    res.status(200).send('VPN server setup completed');
});

// firewall endpoints
app.use('/firewall', firewall_forward_routes);
app.use('/firewall', firewall_set_routes);
app.use('/firewall', firewall_mac_routes);
app.use('/firewall',firewall_custom_rule_routes)

// Suricata Endpoints
app.use('/suricata',suricataRoute);

// DHCP server Endpoints
app.use('/dhcp',dhcpRoute);


server.listen(port, HOST, () => {
    console.log(`Server running at http://${HOST}:${port}`);
});

