import React, { useState } from "react";
import "./form.css";

export const AddElementForm = ({ setName, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    setName: setName || "",
    element: "",
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
    if (!formData.element.trim()) {
      alert("Element cannot be empty.");
      return;
    }
    onSubmit(formData); // Send the entire form data
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content full-screen-form">
        <h2>Add Element to {formData.setName}</h2>
        <form onSubmit={handleSubmit} className="form-grid">

          {/* Element Field */}
          <label>Element</label>
          <input
            type="text"
            name="element"
            value={formData.element}
            onChange={handleChange}
            placeholder="Enter element"
            required
          />

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn update-btn">✅ Submit</button>
            <button type="button" onClick={onCancel} className="btn cancel-btn">❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
