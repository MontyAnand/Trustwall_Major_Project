import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css'; // Ensure CSS is already correctly applied


export const SetList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [setsData, setSetsData] = useState([]);

  useEffect(() => {
    const fetchSetList = async () => {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getSets`
            );
            setSetsData(response.data);
        } catch (err) {
            alert(err.message);
        }
    };
    fetchSetList(); 
}, []);

  const handleCreateSet = () => {
    alert("Create Set clicked!");
  };

  const handleShowElements = (setName) => {
    alert(`Show Elements of Set "${setName}"`);
  };

  const handleUpdateSet = (setName) => {
    alert(`Add Element to Set "${setName}"`);
  };

  const handleDeleteSet = async (setName) => {
    try {
      const response = await axios.put(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteSet`,
        { setName: setName },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  const displayValue = (val) =>
    val !== null && val !== undefined ? val : "-";

  return (
    <div className="table-container">
      <div className="header-section">
        <button onClick={handleCreateSet} className="btn add-btn">➕ Create Set</button>
      </div>

      <div className="table-wrapper">
        <table className="rules-table">
          <thead>
            <tr>
              <th>Set Name</th>
              <th>Type</th>
              <th>Show Elements</th>
            </tr>
          </thead>
          <tbody>
            {setsData.map((set, index) => (
              <React.Fragment key={set.NAME}>
                <tr
                  onClick={() => setSelectedRow(selectedRow === index ? null : index)}
                  className={selectedRow === index ? "row active-row" : "row"}
                >
                  <td>{displayValue(set.NAME)}</td>
                  <td>{displayValue(set.TYPE)}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ backgroundColor: "#17a2b8", color: "#fff" }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row toggle
                        handleShowElements(set.NAME);
                      }}
                    >
                      🔍 Show Elements
                    </button>
                  </td>
                </tr>
                {selectedRow === index && (
                  <tr>
                    <td colSpan="3" className="action-row">
                      <button
                        onClick={() => handleUpdateSet(set.NAME)}
                        className="btn update-btn"
                      >
                        ✏️ Add Element
                      </button>
                      <button
                        onClick={() => handleDeleteSet(set.NAME)}
                        className="btn delete-btn"
                      >
                        🗑️ Delete Set
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
