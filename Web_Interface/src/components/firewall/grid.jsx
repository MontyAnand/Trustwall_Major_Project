import React, { useState, useEffect } from "react";
import './grid.css';
import axios from "axios";

export const GridPopup = ({ setName, onCancel }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchElement();
    }, [setName]);

    const fetchElement = async () => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getSetElements`, {
                params: { setName }
            });
            setData(response.data.map(item => item.ELEMENT));
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };

    const onDelete = async (element) => {
        try {
            const response = await axios.put(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/removeElementFromSet`,
                {
                    setName,
                    element
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            fetchElement();
            alert("Element removed successfully:", response.data);
        } catch (error) {
            console.error("Error removing element:", error);
            alert("Error while removing element");
        }
    }

    return (
        <div className="grid-popup-overlay">
            <div className="grid-popup-content">
                <button className="close-btn" onClick={onCancel}>❌</button>
                <h2 className="grid-title">Elements of <span>{setName}</span></h2>

                {data.length === 0 ? (
                    <div className="no-elements">
                        <p>🚫 Empty Set.</p>
                    </div>
                ) : (
                    <div className="grid-container">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="grid-item"
                            >
                                <div className="element-text">{item}</div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item);
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
