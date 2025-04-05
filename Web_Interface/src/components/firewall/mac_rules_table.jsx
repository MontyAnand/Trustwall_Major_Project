import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css';


export const MACRuleTable = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [rulesData, setRulesData] = useState([]);

    useEffect(() => {
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
        fetchMACRules();
    }, []);

    const handleAddRule = () => {
        alert("Add Rule clicked!");
    };

    const deleteMACRule = async (ID) => {
        try {
            const response = await axios.delete(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteMACRule`,
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
                        {rulesData.map((rule, index) => (
                            <React.Fragment key={rule.ID}>
                                <tr
                                    onClick={() => setSelectedRow(selectedRow === index ? null : index)}
                                    className={selectedRow === index ? "row active-row" : "row"}
                                >
                                    <td>{rule.ID}</td>
                                    <td>{rule.TYPE === 0 ? "MAC" : "SET"}</td>
                                    <td>{rule.MAC}</td>
                                    <td>{rule.INTERFACE}</td>
                                    <td>{rule.ACTION}</td>
                                </tr>
                                {selectedRow === index && (
                                    <tr>
                                        <td colSpan="5" className="action-row">
                                            <button
                                                onClick={() => alert(`Update Rule ${rule.ID}`)}
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
