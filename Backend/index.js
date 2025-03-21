const express = require('express');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
  
};

// API endpoint to save DHCP configuration
// app.post('/dhcp/save', (req, res) => {
//     try {
//         dhcpConfig = req.body;
//         console.log(req.body);
//         // const dhcp_conf_filePath = "/home/po/Desktop/a.txt";
//         // fs.appendFile(dhcp_conf_filePath, generateDhcpConfig(dhcpConfig), (err) => {
//         //     if (err) {
//         //         console.error(err);
//         //         return res.status(500).send('Error saving configuration');
//         //     }
//         //     res.status(200).send('DHCP configuration updated successfully!');
//         // });
//         res.status(200).send("Dekhiye Sujiit   Data aa rhha hai...");
//     }
//     catch (error) {
//         console.error('Error saving DHCP config:', error);
//         res.status(500).send({ message: 'Failed to save DHCP configuration' });
//     }

// });



// Formatting data for writing to configuration file

function generateDhcpConfig(config) {
    return `
# Glabal parameters
option domain-name "example.org";
option domain-name-servers ns1.example.org, ns2.example.org;
default-lease-time 600;
max-lease-time 7200;

# Subnet Declarations
subnet ${config.Subnet} netmask ${config.Subnet_mask} {
    deny bootp;
    option subnet-mask ${config.Subnet_mask};
#    option broadcast-address 192.168.1.255
    option routers ${config.Gateway}
    range ${config.StartIP} ${config.EndIP};
}

# Host DEeclarations
host myhost {
    hardware ethernet 00:A0:78:8E:9E:AA;
    fixed-address 192.168.1.50
}

# Group Declarations
group {
    option routers 192.168.1.254;
    option subnet-mask 255.255.255.0;
    host apex {
        option host-name "apex.example.com";
        hardware ethernet 00:A0:78:8E:9E:AA;
        fixed-address 192.168.1.4;
    }
    host raleigh {
        option host-name "raleigh.example.com";
        hardware ethernet 00:A1:DD:74:C3:F2;
        fixed-address 192.168.1.6;
    }
}

# Pool Declarations
subnet 10.0.0.0 netmask 255.255.255.0 {
    pool {
        range 10.0.0.100 10.0.0.150;
        option routers 10.0.0.254;
    }
    pool {
        range 10.0.0.200 10.0.0.220;
        option routers 10.0.0.1;
    }
}

# PXE Boot Options
option PXE.discovery-control code 6 = unsigned integer 8;
option PXE.boot-server code 8 = {
    unsigned integer 16, unsigned integer 8, ip-address
};

# Dynamic DNS Updates
ddns-update-style none;
ddns-updates off;


`;
}

// app.post('/dhcp/apply', (req, res) => {
//     try {
//         // Logic to apply the configuration goes here
//         // For demonstration, just log the config
//         console.log('Applying DHCP configuration:', dhcpConfig);

//         const configContent = generateDhcpConfig(dhcpConfig);

//         // Save configuration file
//         const dhcp_conf_filePath = "/etc/dhcp/check.conf";
//         fs.appendFile(dhcp_conf_filePath, configContent, (err) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Error saving configuration');
//             }
//             // res.status(200).send('DHCP configuration updated successfully!');
//         });
//         res.status(200).send({ message: 'DHCP configuration applied successfully' });
//     } catch (error) {
//         console.error('Error applying DHCP config:', error);
//         res.status(500).send({ message: 'Failed to apply DHCP configuration' });
//     }
// });


// Define the backend route
app.post('/dhcp/save', function(req, res) {
    const data = req.body;

    // Write data to a file
    const configContent = generateDhcpConfig(dhcpConfig);
    fs.writeFile('/etc/dhcp/check.conf', configContent, function(err) {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send({ message: 'Error writing to file' });
        } else {
            console.log('Data saved to file');
            res.send({ message: 'Data saved successfully' });
        }
    });
});


// For handling OMAPI key generation
//  function to return the selected algorithm
function getAlgorithm(algorithmName) {
    switch (algorithmName) {
        case '1':
            return new AESAlgorithm();
        case '2':
            return new RSAAlgorithm();
        default:
            throw new Error('Unsupported algorithm');
    }
}

// Endpoint to generate key using selected algorithm
app.post('/generateKey', (req, res) => {
    const algorithmName = req.body.algorithm;
    console.log(algorithmName);
    const algorithm = getAlgorithm(algorithmName);
    const key = algorithm.generateKey();
    res.json({ key });
});

server.listen(port, HOST, () => {
    console.log(`Server running at http://${HOST}:${port}`);
});

