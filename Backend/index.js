const express = require('express');
const multer = require('multer');
const path = require('path');
const {Server} = require('socket.io');
const http = require('http');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

const server = http.createServer(app);

const io = new Server(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on('connection', (socket)=>{
    console.log(`Client is conneced with socketID ${socket.id}`);
    socket.emit('connection',"SuccessFully connected with server");
});

app.use(cors({
    origin: '*',
}));

const socketFileMap = new Map();

const getFilename = (req,res,next)=>{
    const socketID = req.body.socketID;
    const filename = req.file.filename;
    if(!socketID || !filename){
        res.satus(400).send("Unable to scan the file!!!");
        return;
    }
    socketFileMap.set(filename,socketID);
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

app.get('/',(req,res)=>{
    res.send("Server is running");
})

// File upload endpoint
app.post('/upload', upload.single('file'), getFilename, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', file: req.file.filename });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

setInterval(()=>{
    socketFileMap.forEach((value,key)=>{
        console.log(`${key} : ${value}`);
        const filepath = path.join('./uploads',key);
        fs.unlink(filepath, (err)=>{
            if(err){
                console.error(`Unable to delete file : ${err}`);
            }
            else{
                console.log("Successfully deleted the file : ",key);
            }
        });
        socketFileMap.delete(key);
    });
}, 60000)
