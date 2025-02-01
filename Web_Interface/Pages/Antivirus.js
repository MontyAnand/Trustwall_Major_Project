import { useState } from "react";
import "./Antivirus.css"; // Import CSS file

function Antivirus() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("File size must be under 50MB.");
        return;
      }
      setFile(selectedFile);
      setScanResult(null);
    }
  };

  // Simulate file scanning
  const startScan = () => {
    if (!file) {
      alert("Please select a file to scan!");
      return;
    }
    setIsScanning(true);
    setScanResult(null);

    // Simulate scan process (3 seconds delay)
    setTimeout(() => {
      setIsScanning(false);
      // Simulate a random scan result
      const isSafe = Math.random() > 0.3; // 70% chance the file is safe
      setScanResult(isSafe ? "✅ No threats found" : "❌ Threat detected");
    }, 3000);
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
