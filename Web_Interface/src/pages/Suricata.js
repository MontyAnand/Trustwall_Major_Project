import React, { useState } from "react";
import "./Suricata.css";

function App() {
    const [interfaces, setInterfaces] = useState([
        {
            name: "WAN (em0)",
            status: "❌",
            patternMatch: "AUTO",
            blockingMode: "DISABLED",
            description: "WAN",
        },
    ]);

    const [settings, setSettings] = useState({
        enableSuricata: false,
        interface: "WAN (em0)",
        description: "",
        sendAlerts: false,
        logFacility: "LOCAL1",
        logPriority: "NOTICE",
        enableStats: false,
        enableHTTPLog: false,
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setSettings({ ...settings, [name]: type === "checkbox" ? checked : value });
    };

    const saveSettings = () => {
        alert("Settings Saved: " + JSON.stringify(settings, null, 2));
    };

    const addInterface = () => {
      const newInterface = {
          name: `New Interface ${interfaces.length + 1}`,
          status: "❌",
          patternMatch: "AUTO",
          blockingMode: "DISABLED",
          description: `Interface ${interfaces.length + 1}`,
      };
      setInterfaces([...interfaces, newInterface]);
  };

  const deleteInterface = (index) => {
      setInterfaces(interfaces.filter((_, i) => i !== index));
  };

    return (
        <div className="suricata-container">
            <h1>Suricata Configuration</h1>

            {/* Add Interface Button */}
            <button className="suricata-add-btn" onClick={addInterface}>+ Add Interface</button>

            {/* Interface Overview Table */}
            <div className="suricata-table-container">
                <h2>Interface Settings Overview</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Interface</th>
                            <th>Suricata Status</th>
                            <th>Pattern Match</th>
                            <th>Blocking Mode</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interfaces.map((intf, index) => (
                            <tr key={index}>
                                <td>{intf.name}</td>
                                <td>{intf.status}</td>
                                <td>{intf.patternMatch}</td>
                                <td>{intf.blockingMode}</td>
                                <td>{intf.description}</td>
                                <td>
                                    <button className="suricata-edit-btn">✏️</button>
                                    <button className="suricata-delete-btn" onClick={() => deleteInterface(index)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Logging & General Settings */}
            <div className="suricata-settings-container">
                <h2>General Settings</h2>
                <div className="">
                <label>
                    <input type="checkbox" name="enableSuricata" checked={settings.enableSuricata} onChange={handleChange} />
                    <p>Enable Suricata</p>
                    </label>
                </div>

                <label>Interface:</label>
                <select name="interface" value={settings.interface} onChange={handleChange}>
                    {interfaces.map((intf, index) => (
                        <option key={index} value={intf.name}>{intf.name}</option>
                    ))}
                </select>

                <label>Description:</label>
                <input type="text" name="description" value={settings.description} onChange={handleChange} />

                <h2>Logging Settings</h2>
                <label>
                    <input type="checkbox" name="sendAlerts" checked={settings.sendAlerts} onChange={handleChange} />
                    <p>Send Alerts to System Log</p>
                </label>

                <label>Log Facility:</label>
                <select name="logFacility" value={settings.logFacility} onChange={handleChange}>
                    <option value="LOCAL1">LOCAL1</option>
                    <option value="LOCAL2">LOCAL2</option>
                </select>

                <label>Log Priority:</label>
                <select name="logPriority" value={settings.logPriority} onChange={handleChange}>
                    <option value="NOTICE">NOTICE</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ERROR">ERROR</option>
                </select>

                <label>
                    <input type="checkbox" name="enableStats" checked={settings.enableStats} onChange={handleChange} />
                    <p>Enable Stats Collection</p>
                </label>

                <label>
                    <input type="checkbox" name="enableHTTPLog" checked={settings.enableHTTPLog} onChange={handleChange} />
                    Enable HTTP Log
                </label>
            </div>

            {/* Save Button */}
            <button className="suricata-save-btn" onClick={saveSettings}>Save Settings</button>
        </div>
    );
}

export default App;
