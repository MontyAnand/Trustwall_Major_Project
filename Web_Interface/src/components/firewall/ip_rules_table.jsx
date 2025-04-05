import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css'; // Ensure CSS covers full height & width

const rulesData = [
  {
    ID: "m947dryom5c",
    SADDR_TYPE: 0,
    SADDR: "172.16.0.1",
    SMASK: 12,
    SPORT_TYPE: 0,
    SPORT: "80",
    DADDR_TYPE: 0,
    DADDR: "192.168.0.1",
    DMASK: 24,
    DPORT_TYPE: 0,
    DPORT: "8080",
    PROTOCOL: "udp",
    INTERFACE: "enp0s9",
    RATE: 200,
    UNIT: "day",
    BURST: 30,
    ACTION: "reject"
  }
];

export const IPRULETable = () => {
  const [rulesData, setRulesData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    const fetchIPRules = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getCustomRules`
            );
            setRulesData(response.data);
        } catch (err) {
            alert(err.message);
        }
    };
    fetchIPRules(); 
}, []);

  const handleAddRule = () => {
    alert("Add Rule clicked!");
  };

  const displayValue = (value) =>
    value !== null && value !== undefined ? value : "-";

  return (
    <div className="table-container">
      <div className="header-section">
        <button onClick={handleAddRule} className="btn add-btn">➕ Add Rule</button>
      </div>

      <div className="table-wrapper">
        <table className="rules-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SADDR TYPE</th>
              <th>SADDR</th>
              <th>SMASK</th>
              <th>SPORT TYPE</th>
              <th>SPORT</th>
              <th>DADDR TYPE</th>
              <th>DADDR</th>
              <th>DMASK</th>
              <th>DPORT TYPE</th>
              <th>DPORT</th>
              <th>PROTOCOL</th>
              <th>INTERFACE</th>
              <th>RATE</th>
              <th>UNIT</th>
              <th>BURST</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rulesData.map((rule, index) => (
              <React.Fragment key={rule.ID}>
                <tr
                  onClick={() =>
                    setSelectedRow(selectedRow === index ? null : index)
                  }
                  className={selectedRow === index ? "row active-row" : "row"}
                >
                  <td>{displayValue(rule.ID)}</td>
                  <td>{displayValue(rule.SADDR_TYPE)}</td>
                  <td>{displayValue(rule.SADDR)}</td>
                  <td>{displayValue(rule.SMASK)}</td>
                  <td>{displayValue(rule.SPORT_TYPE)}</td>
                  <td>{displayValue(rule.SPORT)}</td>
                  <td>{displayValue(rule.DADDR_TYPE)}</td>
                  <td>{displayValue(rule.DADDR)}</td>
                  <td>{displayValue(rule.DMASK)}</td>
                  <td>{displayValue(rule.DPORT_TYPE)}</td>
                  <td>{displayValue(rule.DPORT)}</td>
                  <td>{displayValue(rule.PROTOCOL)?.toUpperCase()}</td>
                  <td>{displayValue(rule.INTERFACE)}</td>
                  <td>{displayValue(rule.RATE)}</td>
                  <td>{displayValue(rule.UNIT)}</td>
                  <td>{displayValue(rule.BURST)}</td>
                  <td>{displayValue(rule.ACTION)}</td>
                </tr>
                {selectedRow === index && (
                  <tr>
                    <td colSpan="17" className="action-row">
                      <button
                        onClick={() => alert(`Update Rule ${rule.ID}`)}
                        className="btn update-btn"
                      >
                        ✏️ Update Rule
                      </button>
                      <button
                        onClick={() => alert(`Delete Rule ${rule.ID}`)}
                        className="btn delete-btn"
                      >
                        🗑️ Delete Rule
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
