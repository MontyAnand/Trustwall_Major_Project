import React, { useState } from "react";
import "./form.css";

export const CreateSetForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    setName: "",
    type: "IP",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.setName.trim()) {
      alert("Set name cannot be empty.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content full-screen-form">
        <h2>Create New Set</h2>
        <form onSubmit={handleSubmit} className="form-grid">

          {/* Set Name */}
          <label>Set Name</label>
          <input
            type="text"
            name="setName"
            value={formData.setName}
            onChange={handleChange}
            placeholder="Enter set name"
            required
          />

          {/* TYPE Dropdown */}
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="IP">IP</option>
            <option value="MAC">MAC</option>
            <option value="PORT">PORT</option>
          </select>

          {/* Action buttons */}
          <div className="form-actions">
            <button type="submit" className="btn update-btn">✅ Submit</button>
            <button type="button" onClick={onCancel} className="btn cancel-btn">❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
