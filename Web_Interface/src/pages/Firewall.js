import Sidebar from "../components/Sidebar";
import { useState } from "react";
import "./Firewall.css"; // Import CSS file

function Firewall() {
  const [port, setPort] = useState("");
  const [ip, setIp] = useState("");
  const [proxy, setProxy] = useState("");
  const [allowNetwork, setAllowNetwork] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState("");
  const [output, setOutput] = useState("");

  // Handle terminal command execution (Simulation)
  const executeCommand = () => {
    if (!terminalCommand.trim()) {
      alert("Enter a command to execute.");
      return;
    }
    setOutput(`$ ${terminalCommand}\nExecuted successfully!`);
    setTerminalCommand("");
  };

  return (
    <>
      <Sidebar />
      <div className="firewall-container">
        <h1 className="firewall-title">🛡️ Firewall</h1>

        <div className="firewall-content">
          {/* Left Side: Manual Entry for Ports, IPs, Proxy */}
          <div className="manual-input">
            <h2>Manual Configuration</h2>

            <label>Port:</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter port number"
            />

            <label>IP Address:</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address"
            />

            <label>Proxy:</label>
            <input
              type="text"
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
              placeholder="Enter proxy"
            />

            {/* Allow or Block Checkbox */}
            <div className="allow-block">
              <input
                type="checkbox"
                checked={allowNetwork}
                onChange={() => setAllowNetwork(!allowNetwork)}
              />
              <span>{allowNetwork ? "Allow Network" : "Block Network"}</span>
            </div>
          </div>

          {/* Right Side: Linux Terminal Simulation */}
          <div className="terminal">
            <h2>Linux Terminal</h2>
            <div className="terminal-screen">
              <pre>{output || "$ Waiting for command..."}</pre>
            </div>
            <input
              type="text"
              value={terminalCommand}
              onChange={(e) => setTerminalCommand(e.target.value)}
              placeholder="Enter Linux command"
            />
            <button onClick={executeCommand}>Execute</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Firewall;
