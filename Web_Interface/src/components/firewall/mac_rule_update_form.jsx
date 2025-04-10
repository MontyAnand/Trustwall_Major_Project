import React, { useState, useEffect } from "react";
import axios from "axios";
import "./form.css";

export const MACRuleForm = ({ rule, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(rule);
  const [setOptions, setSetOptions] = useState([]);
  const [interfaceOptions, setInterfaceOptions] = useState([]);
  useEffect(() => {
    const fetchInterfaces = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_IP}:5000/interfaces`
        );
        setInterfaceOptions(response.data.map(data => data.if));
      } catch (err) {
        alert(err.message);
      }
    };

    fetchInterfaces(); // Call the async function
  }, []);
  useEffect(() => {
    const fetchSetList = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_SERVER_IP}:5000/firewall/getSets`
        );
        setSetOptions(response.data.map(data => data.NAME));
      } catch (err) {
        alert(err.message);
      }
    };
    fetchSetList();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content full-screen-form">
        <h2>Add/Update MAC Rule</h2>
        <form onSubmit={handleSubmit} className="form-grid">

          {/* MAC Type */}
          <label>MAC Address Type</label>
          <select
            name="TYPE"
            value={formData.TYPE}
            onChange={handleChange}
          >
            <option value="MAC">MAC</option>
            <option value="SET">SET</option>
          </select>

          {/* MAC Address Input / Dropdown */}
          <label>MAC Address</label>
          {formData.TYPE === "MAC" ? (
            <input
              type="text"
              name="MAC"
              value={formData.MAC}
              onChange={handleChange}
              placeholder="Enter MAC address"
            />
          ) : (
            <select
              name="MAC"
              value={formData.MAC}
              onChange={handleChange}
            >
              <option value="">Select Set</option>
              {setOptions.map((set) => (
                <option key={set} value={set}>
                  {set}
                </option>
              ))}
            </select>
          )}

          {/* Interface */}
          <label>Interface</label>
          <select
            name="INTERFACE"
            value={formData.INTERFACE}
            onChange={handleChange}
          >
            <option value="">Select Interface</option>
            {interfaceOptions.map((iface) => (
              <option key={iface} value={iface}>
                {iface}
              </option>
            ))}
          </select>

          {/* Action */}
          <label>Action</label>
          <select
            name="ACTION"
            value={formData.ACTION}
            onChange={handleChange}
          >
            <option value="accept">accept</option>
            <option value="reject">reject</option>
            <option value="drop">drop</option>
          </select>

          <div className="form-actions">
            <button type="submit" onClick={handleSubmit} className="btn update-btn">✅ Submit</button>
            <button type="button" onClick={onCancel} className="btn cancel-btn">❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
