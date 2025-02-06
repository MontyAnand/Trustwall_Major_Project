import { useEffect, useState } from "react";
import "./Antivirus.css"; // Import CSS file
import axios from "axios";
import {useSocket} from "../Contexts/socketContex";

function Antivirus() {

  const {socket , socketID} = useSocket();
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");


  useEffect(()=>{
    if(!socket) return;

    socket.on('scan-result', (data)=>{
      setScanResult (scanResult => scanResult + data);
    });

    socket.on('scan-completed',()=>{
      setIsScanning(false);
    })

    return ()=>{
      socket.off('scan-result');
      socket.off('scan-completed');
    }
  },[socket]);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("File size must be under 50MB.");
        return;
      }
      setFile(selectedFile);
      setScanResult("");
    }
  };

  const startScan = async () => {
    if (!file) {
      alert("Please select a file to scan!");
      return;
    }

    console.log(socket.id);

    if(!socket.id){
      setScanResult("Unable to scan: Not connect to Server");
      return;
    }
    setIsScanning(true);
    setScanResult("");

    // Simulate scan process (3 seconds delay)
    // setTimeout(() => {
    //   setIsScanning(false);
    //   // Simulate a random scan result
    //   const isSafe = Math.random() > 0.3; // 70% chance the file is safe
    //   setScanResult(isSafe ? "✅ No threats found" : "❌ Threat detected");
    // }, 3000);


    // Uploading file to backend Server

    const formData = new FormData();
    formData.append("file", file);
    formData.append("socketID",socket.id);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      setScanResult("Unable to upload file");
      setIsScanning(false);
      console.error("Error uploading file:", error);
    }

  };

  return (
    <div className="antivirus-container">
      <div className="scanner-box">
        {/* Title */}
        <h1 className="scanner-title">🛡️ Antivirus Scanning</h1>

        {/* File Upload */}
        <label className="upload-btn">
          Select File
          <input type="file" onChange={handleFileChange} className="hidden-file-input" />
        </label>

        {/* Show selected file name */}
        {file && <p className="file-name">{file.name}</p>}

        {/* Scan Button */}
        <button onClick={startScan} className="scan-btn" disabled={isScanning}>
          {isScanning ? "Scanning..." : "Start Scan"}
        </button>

        {/* Buffering Image (Loader) */}
        {isScanning && (
          <div className="loader">
            <img src="https://i.gifer.com/ZZ5H.gif" alt="Scanning..." />
          </div>
        )}

        {/* Scan Result */}
        {scanResult && <p className={`scan-result ${scanResult.includes("❌") ? "danger" : "safe"}`}>{scanResult}</p>}
      </div>
    </div>
  );
}

export default Antivirus;
