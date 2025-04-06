import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css'; // assuming you're using the same CSS file
import { MACRuleForm } from "./mac_rule_update_form";

const newForm = {
    TYPE: "MAC",
    MAC: "",
    INTERFACE: "",
    ACTION: "accept",
};

export const MACRuleTable = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [rulesData, setRulesData] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [newRule, setNewRule] = useState(false);

    useEffect(() => {
        fetchMACRules();
    }, []);

    const fetchMACRules = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getMACRules`
            );
            setRulesData(response.data);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAddRule = () => {
        setNewRule(true);
    };

    const deleteMACRule = async (ID) => {
        try {
            const response = await axios.delete(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteMACRule`,
                {
                    params: { ID }
                }
            );
            alert('Deleted:', JSON.stringify(response.data));
            fetchMACRules();
        } catch (error) {
            alert('Error deleting MAC rule:', JSON.stringify(error));
            console.log(error);
        }
    };

    const handleUpdateClick = (rule) => {
        setSelectedRule(rule);
        setShowUpdateForm(true);
    };

    const handleFormClose = () => {
        setShowUpdateForm(false);
        setSelectedRule(null);
    };

    const addNewMACRule = async (data) => {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/addMACRule`,
                data,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            fetchMACRules();
            console.log('MAC Rule added:', response.data);
            alert(JSON.stringify(response.data));
        } catch (error) {
            console.error('Error adding MAC rule:', error);
            alert('Error:', JSON.stringify(error.message));
        }
        setNewRule(false);
    };

    const handleFormSubmit = async (data) => {
        try {
            const response = await axios.put(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/updateMACRule`,
                data,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            fetchMACRules();
            alert('Updated:', JSON.stringify(response.data));
        } catch (error) {
            alert('Error:', JSON.stringify(error.message));
            console.log(error);
        }
        setShowUpdateForm(false);
        setSelectedRule(null);
    };

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
                            <th>Type</th>
                            <th>MAC Address</th>
                            <th>Interface</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rulesData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-rules-cell">
                                    🚫 No rules found.
                                </td>
                            </tr>
                        ) : (
                            rulesData.map((rule, index) => (
                                <React.Fragment key={rule.ID}>
                                    <tr
                                        onClick={() => setSelectedRow(selectedRow === index ? null : index)}
                                        className={selectedRow === index ? "row active-row" : "row"}
                                    >
                                        <td>{rule.ID}</td>
                                        <td>{rule.TYPE}</td>
                                        <td>{rule.MAC}</td>
                                        <td>{rule.INTERFACE}</td>
                                        <td>{rule.ACTION}</td>
                                    </tr>
                                    {selectedRow === index && (
                                        <tr>
                                            <td colSpan="5" className="action-row">
                                                <button
                                                    onClick={() => handleUpdateClick(rule)}
                                                    className="btn update-btn"
                                                >
                                                    ✏️ Update Rule
                                                </button>
                                                <button
                                                    onClick={() => deleteMACRule(rule.ID)}
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
                <MACRuleForm
                    rule={selectedRule}
                    onCancel={handleFormClose}
                    onSubmit={handleFormSubmit}
                />
            )}
            {newRule && (
                <MACRuleForm
                    rule={newForm}
                    onCancel={() => setNewRule(false)}
                    onSubmit={addNewMACRule}
                />
            )}
        </div>
    );
};
