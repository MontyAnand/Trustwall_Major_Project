import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css'; // Custom CSS file for styling


export const ForwardRuleTable = () => {
  const [rulesData, setRulesData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    const fetchForwardRules = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getForwardRules`
        );
        setRulesData(response.data);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchForwardRules();
  }, []);

  const handleAddRule = () => {
    alert("Add Rule clicked!");
  };

  const deleteForwardRule = async (ID) => {
    try {
      const response = await axios.delete(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteForwardRule`,
        {
          params: {
            ID: ID
          }
        }
      );
  
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error deleting forward rule:', error);
    }
  };

  const displayValue = (value) => value !== null && value !== undefined ? value : "-";

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
              <th>Interface</th>
              <th>Type</th>
              <th>Source IP</th>
              <th>MASK</th>
              <th>Protocol</th>
              <th>Dest. PORT</th>
              <th>Redirected IP</th>
              <th>Redirected PORT</th>
            </tr>
          </thead>
          <tbody>
            {rulesData.map((rule, index) => (
              <React.Fragment key={rule.ID}>
                <tr
                  onClick={() => setSelectedRow(selectedRow === index ? null : index)}
                  className={selectedRow === index ? "row active-row" : "row"}
                >
                  <td>{displayValue(rule.ID)}</td>
                  <td>{displayValue(rule.INTERFACE)}</td>
                  <td>{displayValue(rule.SADDR_TYPE)}</td>
                  <td>{displayValue(rule.SADDR)}</td>
                  <td>{displayValue(rule.MASK)}</td>
                  <td>{displayValue(rule.PROTOCOL)}</td>
                  <td>{displayValue(rule.DPORT)}</td>
                  <td>{displayValue(rule.REDIRECTED_IP)}</td>
                  <td>{displayValue(rule.REDIRECTED_PORT)}</td>
                </tr>
                {selectedRow === index && (
                  <tr>
                    <td colSpan="9" className="action-row">
                      <button onClick={() => alert(`Update Rule ${rule.ID}`)} className="btn update-btn">✏️ Update Rule</button>
                      <button onClick={() => deleteForwardRule(rule.ID)} className="btn delete-btn">🗑️ Delete Rule</button>
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
