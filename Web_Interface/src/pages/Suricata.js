import React, { useState } from "react";
import { Link} from "react-router-dom";
import Sidebar from "../components/Sidebar";

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

  const [selectedRules, setSelectedRules] = useState({
    ETOpen: false,
    ETPro: false,
    Snort: false,
    SnortGPLV2: false,
    FeodoTracker: false,
    AbuseCH: false,
  });

  const [customUrls, setCustomUrls] = useState({
    ETOpen: "",
    ETPro: "",
    Snort: "",
    SnortGPLV2: "",
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({ ...settings, [name]: type === "checkbox" ? checked : value });
  };

  const handleCheckboxChange = (rule) => {
    setSelectedRules((prev) => ({
      ...prev,
      [rule]: !prev[rule],
    }));
  };

  const handleCustomUrlChange = (rule, value) => {
    setCustomUrls((prev) => ({
      ...prev,
      [rule]: value,
    }));
  };

  const saveSettings = () => {
    if (!settings.description.trim()) {
      alert("Description cannot be empty!");
      return;
    }
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
    if (window.confirm("Are you sure you want to delete this interface?")) {
      setInterfaces(interfaces.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <Sidebar />
      <div className="suricata-container">
        <h1>Suricata Configuration</h1>

        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Interfaces</Link>
            </li>
            <li>
              <Link  to="/global-settings">Global Settings</Link>
            </li>
            <li>
              <Link  to="/updates">Updates</Link>
            </li>
            <li>
              <Link to="/alerts">Alerts</Link>
            </li>
            <li>
              <Link to="/blocks">Blocks</Link>
            </li>
            <li>
              <Link to="/files">Files</Link>
            </li>
            <li>
              <Link to="/pass-lists">Pass Lists</Link>
            </li>
            <li>
              <Link to="/suppress">Suppress</Link>
            </li>
            <li>
              <Link to="/logs-view">Logs View</Link>
            </li>
            <li>
              <Link to="/logs-mgmt">Logs Mgmt</Link>
            </li>
            <li>
              <Link to="/sid-mgmt">SID Mgmt</Link>
            </li>
          </ul>
        </nav>

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
                    <button
                      className="suricata-delete-btn"
                      onClick={() => deleteInterface(index)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="suricata-add-btn" onClick={addInterface}>
            + Add Interface
          </button>
        </div>

        <div className="suricata-settings-container">
          <h2>General Settings</h2>
          <label>
            <input
              type="checkbox"
              name="enableSuricata"
              checked={settings.enableSuricata}
              onChange={handleChange}
            />
            Enable Suricata
          </label>

          <label>Interface:</label>
          <select
            name="interface"
            value={settings.interface}
            onChange={handleChange}
          >
            {interfaces.map((intf, index) => (
              <option key={index} value={intf.name}>
                {intf.name}
              </option>
            ))}
          </select>

          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={settings.description}
            onChange={handleChange}
          />

          <h2>Logging Settings</h2>
          <label>
            <input
              type="checkbox"
              name="sendAlerts"
              checked={settings.sendAlerts}
              onChange={handleChange}
            />
            Send Alerts to System Log
          </label>

          <label>Log Facility:</label>
          <select
            name="logFacility"
            value={settings.logFacility}
            onChange={handleChange}
          >
            <option value="LOCAL1">LOCAL1</option>
            <option value="LOCAL2">LOCAL2</option>
          </select>

          <label>Log Priority:</label>
          <select
            name="logPriority"
            value={settings.logPriority}
            onChange={handleChange}
          >
            <option value="NOTICE">NOTICE</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
          </select>

          <label>
            <input
              type="checkbox"
              name="enableStats"
              checked={settings.enableStats}
              onChange={handleChange}
            />
            Enable Stats Collection
          </label>

          <label>
            <input
              type="checkbox"
              name="enableHTTPLog"
              checked={settings.enableHTTPLog}
              onChange={handleChange}
            />
            Enable HTTP Log
          </label>
        </div>

        <h2>Choose Suricata Rule Types</h2>

        {[
          "ETOpen",
          "ETPro",
          "Snort",
          "SnortGPLV2",
          "FeodoTracker",
          "AbuseCH",
        ].map((rule) => (
          <div key={rule}>
            <input
              type="checkbox"
              checked={selectedRules[rule]}
              onChange={() => handleCheckboxChange(rule)}
            />
            <label>Install {rule} Rules</label>
            {["ETOpen", "ETPro", "Snort", "SnortGPLV2"].includes(rule) &&
              selectedRules[rule] && (
                <input
                  type="text"
                  placeholder={`Custom URL for ${rule}`}
                  value={customUrls[rule]}
                  onChange={(e) => handleCustomUrlChange(rule, e.target.value)}
                />
              )}
          </div>
        ))}

        <h3>Selected Rules:</h3>
        <ul>
          {Object.keys(selectedRules).map(
            (rule) =>
              selectedRules[rule] && (
                <li key={rule}>
                  {rule} - {customUrls[rule] || "Default URL"}
                </li>
              )
          )}
        </ul>

        <button className="suricata-save-btn" onClick={saveSettings}>
          Save Settings
        </button>

        <h2>Alert and Block Settings</h2>
        <h2>Performance and Detection Engine Settings</h2>
      </div>
    </>
  );
}

export default App;
