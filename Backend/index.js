const express = require('express');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { socketFileMap, socketUserMap } = require('./utility/maps');
const { SocketQueue, serviceListQueue } = require('./utility/queue');
const { client } = require('./tcpClient');

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
    socket.on('update-service-status',(data)=>{
        tcpClient.serviceManagementRquest(data);
    });
});

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

server.listen(port, HOST, () => {
    console.log(`Server running at http://${HOST}:${port}`);
});

