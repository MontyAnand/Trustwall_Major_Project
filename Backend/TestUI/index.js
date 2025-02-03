const socket = io('http://localhost:3000');

socket.on('connection', (data)=>{
    console.log(data,` with socketID : ${socket.id}`);
    
});

async function uploadFile(e) {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        document.getElementById('status').innerText = "Please select a file.";
        return;
    }
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append('socketID',socket.id);
    
    try {
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });
        
        if (response.ok) {
            document.getElementById('status').innerText = "File uploaded successfully!";
        } else {
            document.getElementById('status').innerText = "Upload failed.";
        }
    } catch (error) {
        document.getElementById('status').innerText = "Error: " + error.message;
    }
}