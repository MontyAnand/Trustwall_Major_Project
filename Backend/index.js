const express = require('express');
const multer = require('multer');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const net = require('net');

const app = express();
const port = 5000;

const scanFile = (filename, socketID, io) => {
    const SERVER_IP = "127.0.0.1";  // Change if the server is on another machine
    const SERVER_PORT = 8080;
    const client = new net.Socket();
    client.connect(SERVER_PORT, SERVER_IP, () => {
        console.log("Connected to server");

        // Send a message to the server
        client.write(filename);
    });

    // Receive data from the server
    client.on("data", (data) => {
        console.log("Server:", data.toString());
        // Close the connection after receiving the response
        client.end();
    });

    // Handle connection close
    client.on("close", () => {
        console.log("Connection closed");
        const reportPath = path.join('./uploads', filename + ".report");
        const stream = fs.createReadStream(reportPath, { encoding: "utf8" });
        stream.on("data", chunk => {
            io.to(socketID).emit('scan-result', chunk);
        });

        stream.on("end", () => {
            io.to(socketID).emit('scan-completed');
            const filepath = path.join('./uploads', filename);
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error(`Unable to delete file : ${err}`);
                }
                else {
                    console.log("Successfully deleted the file : ", filename);
                }
            });

            fs.unlink(reportPath,(err)=>{
                if(err){
                    console.error("Unable to delete file: ",err);
                }
                else {
                    console.log("Successfully deleted the file : ",reportPath);
                }
            });
        });

        stream.on("error", err => {
            console.error("Error reading file:", err);
        });

    });

    // Handle errors
    client.on("error", (err) => {
        console.error("Connection error:", err.message);
    });
}

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log(`Client is conneced with socketID ${socket.id}`);
    socket.emit('connection', "SuccessFully connected with server");
});

app.use(cors({
    origin: '*',
}));

const socketFileMap = new Map();

const getFilename = (req, res, next) => {
    const socketID = req.body.socketID;
    const filename = req.file.filename;
    if (!socketID || !filename) {
        res.status(400).send("Unable to scan the file!!!");
        return;
    }
    socketFileMap.set(filename, socketID);
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

// Serve static files
app.use(express.static('public'));

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

server.listen(port, "192.168.87.123", () => {
    console.log(`Server running at http://192.168.87.123:${port}`);
});

setInterval(() => {
    socketFileMap.forEach((value, key) => {
        console.log(`${key} : ${value}`);
        scanFile(key, value, io);
        // const filepath = path.join('./uploads',key);
        // fs.unlink(filepath, (err)=>{
        //     if(err){
        //         console.error(`Unable to delete file : ${err}`);
        //     }
        //     else{
        //         console.log("Successfully deleted the file : ",key);
        //     }
        // });
        socketFileMap.delete(key);
    });
}, 1000)
