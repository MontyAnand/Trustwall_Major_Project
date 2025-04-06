import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css';
import { UpdateIPRuleForm } from "./ip_rule_update_form";

const newForm = {
  SADDR_TYPE: "IP",
  SADDR: "",
  SMASK: "",
  SPORT_TYPE: "PORT",
  SPORT: "",
  DADDR_TYPE: "IP",
  DADDR: "",
  DMASK: "",
  DPORT_TYPE: "PORT",
  DPORT: "",
  PROTOCOL: "",
  INTERFACE: "",
  RATE: "",
  UNIT: "second",
  BURST: "",
  ACTION: "accept",
};

export const IPRULETable = () => {
  const [rulesData, setRulesData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editRule, setEditRule] = useState(null);
  const [newRule, setNewRule] = useState(false);

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

  useEffect(() => {
    fetchIPRules();
  }, []);

  const handleAddRule = () => {
    setNewRule(true);
  };

  const addNewIPRule = async (data) => {
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/addCustomRule`,
        data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchIPRules();
      alert('IP rule added:', JSON.stringify(response.data));
    } catch (error) {
      alert('IP rule add Error:', JSON.stringify(error.message));
    }
    setNewRule(false);
  }

  const deleteIPRule = async (ID) => {
    try {
      await axios.delete(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteCustomRule`,
        { params: { ID } }
      );
      fetchIPRules();
    } catch (error) {
      alert('IP rule delete Error:', JSON.stringify(error.message));
    }
  };

  const updateIPRule = async (data) => {
    try {
      const response = await axios.put(`http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/updateCustomRule`,
        data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('IP rule Updated:', JSON.stringify(response.data));
      fetchIPRules();
    } catch (error) {
      alert('IP rule Update Error:', JSON.stringify(error.message));
    }
    setEditRule(null)
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
                        onClick={() => setEditRule(rule)}
                        className="btn update-btn"
                      >
                        ✏️ Update Rule
                      </button>
                      <button
                        onClick={() => deleteIPRule(rule.ID)}
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

      {editRule && (
        <UpdateIPRuleForm
          rule={editRule}
          onCancel={() => setEditRule(null)}
          onSubmit={updateIPRule}
        />
      )}
      {newRule && (
        <UpdateIPRuleForm
          rule={newForm}
          onCancel={() => setNewRule(false)}
          onSubmit={addNewIPRule}
        />
      )}
    </div>
  );
};
