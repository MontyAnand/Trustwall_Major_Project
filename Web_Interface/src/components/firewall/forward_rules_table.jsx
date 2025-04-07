import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css';
import { RedirectRuleForm } from "./forward_rule_update_form";

const newForm = {
  INTERFACE: "",
  SADDR_TYPE: "IP",
  SADDR: "",
  SMASK: "",
  PROTOCOL: "",
  DPORT: "",
  REDIRECT_IP: "",
  REDIRECT_PORT: "",
};

export const ForwardRuleTable = () => {
  const [rulesData, setRulesData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [newRule, setNewRule] = useState(false);

  useEffect(() => {
    fetchForwardRules();
  }, []);

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

  const handleAddRule = () => {
    setNewRule(true);
  };

  const addNewForwardRule = async (data) => {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/addForwardRule`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      fetchForwardRules();
      alert('Forward rule added:', JSON.stringify(response.data));
    } catch (error) {
      alert('Error adding forward rule:', error.message);
      console.log(error);
    }
    setNewRule(false);
  };

  const deleteForwardRule = async (ID) => {
    try {
      const response = await axios.delete(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteForwardRule`,
        {
          params: { ID }
        }
      );
      alert('Forward rule deleted:', JSON.stringify(response.data));
      fetchForwardRules();
    } catch (error) {
      alert('Error deleting forward rule:', error.message);
      console.log(error);
    }
  };

  const handleUpdateClick = (rule) => {
    setShowUpdateForm(true);
    setSelectedRule(rule);
  };

  const handleFormClose = () => {
    setShowUpdateForm(false);
    setSelectedRule(null);
  };

  const handleFormSubmit = async (updatedRule) => {
    try {
      const response = await axios.put(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/updateForwardRule`,
        updatedRule
      );
      fetchForwardRules();
      alert('Forward rule updated:', JSON.stringify(response.data));
      console.log(response.data);
    } catch (error) {
      alert('Error updating forward rule:', error.message);
      console.log(error);
    }
    handleFormClose();
  };

  const displayValue = (value) =>
    value !== null && value !== undefined ? value : "-";

  return (
    <div className="table-container">
      <div className="header-section">
        <button onClick={handleAddRule} className="btn add-btn">
          ➕ Add Rule
        </button>
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
            {rulesData.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-rules-cell">
                  🚫 No rules found.
                </td>
              </tr>
            ) : (
              rulesData.map((rule, index) => (
                <React.Fragment key={rule.ID}>
                  <tr
                    onClick={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                    className={
                      selectedRow === index ? "row active-row" : "row"
                    }
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
                        <button
                          onClick={() => handleUpdateClick(rule)}
                          className="btn update-btn"
                        >
                          ✏️ Update Rule
                        </button>
                        <button
                          onClick={() => deleteForwardRule(rule.ID)}
                          className="btn delete-btn"
                        >
                          🗑️ Delete Rule
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showUpdateForm && selectedRule && (
        <RedirectRuleForm
          rule={selectedRule}
          onCancel={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
      {newRule && (
        <RedirectRuleForm
          rule={newForm}
          onCancel={() => setNewRule(false)}
          onSubmit={addNewForwardRule}
        />
      )}
    </div>
  );
};
