import React, { useEffect, useState } from "react";
import axios from "axios";
import './ForwardRuleTable.css';
import { CreateSetForm } from './create_set_form';
import { GridPopup } from "./grid";
import {AddElementForm} from './add_element_to_set_form'

export const SetList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [setsData, setSetsData] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [currentSet, setCurrentSet] = useState("");
  const [showCreateSetForm, setShowCreateSetForm] = useState(false);
  const [showAddElementForm, setShowAddElementForm] = useState(false);

  useEffect(() => {
    fetchSetList();
  }, []);

  const fetchSetList = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getSets`);
      setSetsData(response.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateSet = () => {
    setShowCreateSetForm(true);
  };

  const handleShowElements = async (setName) => {
    setCurrentSet(setName);
    setShowGrid(true);
  };

  const handleUpdateSet = (setName) => {
    setCurrentSet(setName);
    setShowAddElementForm(true);
  };

  const handleDeleteSet = async (setName) => {
    try {
      const response = await axios.put(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/deleteSet`,
        { setName },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      fetchSetList();
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  const handleDeleteElement = (element) => {
    alert(`Delete element: ${element}`);
    // Optional: Add axios call to delete the element from backend
  };

  const addElement = async (data)=>{
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/addElementToSet`,
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Element added successfully:", response.data);
    } catch (error) {
      console.error("Error adding element:", error);
    }
    setShowAddElementForm(false);
  }

  const createSet = async (data) => {
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/createSet`,
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      fetchSetList();
      console.log("Set created successfully:", response.data);
      alert("Set created successfully:", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error creating set:", error.message);
      alert("Error creating set:", error.message);
    }
    setShowCreateSetForm(false);
  }

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
            {setsData.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-rules-cell">
                  🚫 No sets exist.
                </td>
              </tr>
            ) : (
              setsData.map((set, index) => (
                <React.Fragment key={set.NAME}>
                  <tr
                    onClick={() => setSelectedRow(selectedRow === index ? null : index)}
                    className={selectedRow === index ? "row active-row" : "row"}
                  >
                    <td>{set.NAME}</td>
                    <td>{set.TYPE}</td>
                    <td>
                      <button
                        className="btn"
                        style={{ backgroundColor: "#17a2b8", color: "#fff" }}
                        onClick={(e) => {
                          e.stopPropagation();
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
                        <button onClick={() => handleUpdateSet(set.NAME)} className="btn update-btn">✏️ Add Element</button>
                        <button onClick={() => handleDeleteSet(set.NAME)} className="btn delete-btn">🗑️ Delete Set</button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showGrid && currentSet && (
        <GridPopup
          setName={currentSet}
          onCancel={() => setShowGrid(false)}
          onDelete={handleDeleteElement}
        />
      )}

      {showCreateSetForm && (
        <CreateSetForm
          onCancel={() => setShowCreateSetForm(false)}
          onSubmit={createSet}
        />
      )}

      {currentSet && showAddElementForm && (
        <AddElementForm
          setName={currentSet}
          onCancel={() => setShowAddElementForm(false)}
          onSubmit={addElement}
        />
      )}

    </div>
  );
};
