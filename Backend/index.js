const express = require('express');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs=require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { socketFileMap, socketUserMap, ClientIDMap } = require('./utility/maps');
const { SocketQueue, serviceListQueue } = require('./utility/queue');
const { client } = require('./tcpClient');
const firewall_routes = require('./Routes/firewall_routes');
const firewall_zone_routes = require('./Routes/firewall_zone_routes');
const firewall_policy_routes = require('./Routes/firewall_policy_routes');
const firewall_ipset_routes = require('./Routes/firewall_ipset_routes');
const firewall_service_routes = require('./Routes/firewall_service_routes');
const firewall_icmptype_routes = require('./Routes/firewall_icmptype_routes');

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

// firewall endpoints
app.use('/firewall', firewall_routes);
app.use('/firewall', firewall_zone_routes);
app.use('/firewall', firewall_policy_routes);
app.use('/firewall', firewall_ipset_routes);
app.use('/firewall', firewall_service_routes);
app.use('/firewall', firewall_icmptype_routes);



// This part is to manage DHCP configuration

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Example in-memory storage for demonstration purposes
let dhcpConfig = {
    lan: '',
    bootp: '',
    clientAccept: '',
    denyClient: '',
    ignoreClientID: '',
    subnet:'',
    netmask:'',
    startIP: '',
    endIP: ''
};

// API endpoint to save DHCP configuration
app.post('/dhcp/save', (req, res) => {
    try {
        dhcpConfig = req.body;
        const dhcp_conf_filePath = "/home/po/Desktop/a.txt";
        fs.appendFile(dhcp_conf_filePath, generateDhcpConfig(dhcpConfig), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving configuration');
            }
            res.status(200).send('DHCP configuration updated successfully!');
        });
    }
 catch (error) {
    console.error('Error saving DHCP config:', error);
    res.status(500).send({ message: 'Failed to save DHCP configuration' });
}
    
});

// API endpoint to apply DHCP configuration

function generateDhcpConfig(config) {
    return `

# DHCP Server Configuration
subnet ${config.subnet} netmask ${config.netmask} {
range ${config.startIP} ${config.endIP};
option routers ${config.defaultGateway};
option domain-name-servers ${config.dnsServer1} , ${config.dnsServer2};
option domain-name ${config.domainName};
option ntp-servers ${config.ntpServer};
default-lease-time ${config.defaultLeaseTime};
max-lease-time ${config.maxLeaseTime};
}
`;
}

app.post('/dhcp/apply', (req, res) => {
    try {
        // Logic to apply the configuration goes here
        // For demonstration, just log the config
        console.log('Applying DHCP configuration:', dhcpConfig);

        const configContent = generateDhcpConfig(dhcpConfig);

        // Save configuration file
        const dhcp_conf_filePath = "/etc/dhcp/check.conf";
        fs.appendFile(dhcp_conf_filePath, configContent, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving configuration');
            }
            // res.status(200).send('DHCP configuration updated successfully!');
        });
        res.status(200).send({ message: 'DHCP configuration applied successfully' });
    } catch (error) {
        console.error('Error applying DHCP config:', error);
        res.status(500).send({ message: 'Failed to apply DHCP configuration' });
    }
});


server.listen(port, HOST, () => {
    console.log(`Server running at http://${HOST}:${port}`);
});

