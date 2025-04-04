const express = require('express');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const os = require('os');
const { socketFileMap, socketUserMap, ClientIDMap } = require('./utility/maps');
const { SocketQueue, serviceListQueue } = require('./utility/queue');
const { client } = require('./tcpClient');

const firewall_forward_routes = require('./Routes/firewall_forward');
const { config } = require('process');

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

// firewall endpoints
app.use('/firewall', firewall_forward_routes);



// This part is to manage DHCP configuration

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Function to generate DHCP configuration
function generateDhcpConfig(data) {
    let configLines = [];

    configLines.push(`# dhcpd.conf
#
# Sample configuration file for ISC dhcpd
#

# option definitions common to all supported networks...
option domain-name "example.org";
option domain-name-servers ns1.example.org, ns2.example.org;

default-lease-time 600;
max-lease-time 7200;

# The ddns-updates-style parameter controls whether or not the server will
# attempt to do a DNS update when a lease is confirmed. We default to the
# behavior of the version 2 packages ('none', since DHCP v2 didn't
# have support for DDNS.)
ddns-update-style none;

# If this DHCP server is the official DHCP server for the local
# network, the authoritative directive should be uncommented.
#authoritative;

# Use this to send dhcp log messages to a different log file (you also
# have to hack syslog.conf to complete the redirection).
#log-facility local7;\n`);

    if (data.Omapi_port && data.Omapi_key) {
        configLines.push(`
# Enable OMAPI on port ${data.Omapi_port}
omapi-port ${data.Omapi_port};

# Optional: Secure with authentication key
key omapi_key {
    algorithm HMAC-MD5;
    secret "${data.Omapi_key}";
};

`);
    }

    if (data.Dhcp_lease_time_format_UTC_to_Local_enable===true) {
        configLines.push(`# This will change time format from UTC to Local in DHCP lease file`);
        configLines.push(`db-time-format local;`);
        configLines.push(`\n`);
    }

    if (data.Bootp_enable===true) {
        configLines.push(`# This will ignore all BOOTP queries coming to the server`);
        configLines.push(`ignore bootp;`);
        configLines.push(`\n`);
    }

    if (data.Deny_unknown_clients===1) {
        configLines.push(`# This will not allow any Unknown DHCP clients from any interface`);
        configLines.push(`deny unknown-clients;`);
        configLines.push(`\n`);
    }

    if (data.Ignore_client_identifier===true) {
        configLines.push(`# This will not record any UID for a specific client, only record MAC address in client's lease data`);
        configLines.push(`ignore client-updates;`);
        configLines.push(`\n`);
    }

    if (data.Static_arp_entries_enable===true) {
        configLines.push(`# This will force the system to keep static ARP entries.Clients must mactch ARP entries to get a IP`);
        configLines.push(`option arp-cache-timeout 0;`);
        configLines.push(`\n`);
    }

    if (data.Ping_check_disable===true) {
        configLines.push(`# This will disable ping check for a  IP address `);
        configLines.push(`ping-check false;`);
        configLines.push(`ping-timeout ${data.Ping_check_timeout};`);
    }

    if (data.Subnet && data.Subnet_mask) {
        configLines.push(`\n
# Subnet Specific Configuration
`);

        configLines.push(`subnet ${data.Subnet} netmask ${data.Subnet_mask} {`);

        if (data.StartIP && data.EndIP) {
            configLines.push(`  range ${data.StartIP} ${data.EndIP};`);
        }
        if (data.Dns0 || data.Dns1 || data.Dns2 | data.Dns3) {
            configLines.push(`  option domain-name-servers ${data.Dns0 ? data.Dns0 : ''} ${data.Dns1 ? ', ' + data.Dns1 : ''} ${data.Dns2 ? ', ' + data.Dns2 : ''} ${data.Dns3 ? ', ' + data.Dns3 : ''};`);
        }

        if (data.Domain_name) {
            configLines.push(`  option domain-name "${data.Domain_name}";`);
        }

        if (data.Domain_search_list) {
            configLines.push(`  option domain-search "${data.Domain_search_list}";`);
        }

        if (data.Gateway) {
            configLines.push(`  option routers ${data.Gateway};`);
        }

        if (data.Wins1 || data.Wins2) {
            configLines.push(`  option netbios-name-servers ${data.Wins1 ? data.Wins1 : ''} ${data.Wins2 ? ', ' + data.Wins2 : ''};`);
        }


        if (data.Default_lease_time) {
            configLines.push(`  default-lease-time ${data.Default_lease_time};`);
        }

        if (data.Maximum_lease_time) {
            configLines.push(`  max-lease-time ${data.Maximum_lease_time};`);
        }

        configLines.push("}"); // Close subnet block
    }

    return configLines.join("\n");
}


// Define the backend route
app.post('/dhcp/save', function (req, res) {
    const data = req.body;
    console.log(data);
    // Write data to a file
    const dhcpFilePath="/etc/dhcp/check.conf";
    const dhcpConfig = generateDhcpConfig(data);
    fs.writeFile(dhcpFilePath, dhcpConfig, function (err) {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send({ message: 'Error writing to file' });
        } else {
            console.log('DHCP configuration Data is saved to a file location ',dhcpFilePath);
            res.send({ message: 'DHCP Data is saved successfully.' });
        }
    });
});



// This is for interface data
// Allow frontend to access this API (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// For handling OMAPI key generation

//  function to return the selected algorithm
function getAlgorithm(algorithmName) {
    switch (algorithmName) {
        case '1':
            return "md5";
        case '2':
            return "sha1";
        default:
            throw new Error('Unsupported algorithm');
    }
}
// Endpoint to generate key using selected algorithm
app.post('/generateKey', (req, res) => {
    const key = "sujit";
    try {
        const algorithmName = req.body.omapialgo;
        const algorithm = getAlgorithm(algorithmName);
        const hmac_key = crypto.createHmac(algorithm, key).digest('hex');
        res.status(200).send({ hmac_key });
    } catch (error) {
        res.status(500).send("Error in generation of key");
    }
});

server.listen(port, HOST, () => {
    console.log(`Server running at http://${HOST}:${port}`);
});

