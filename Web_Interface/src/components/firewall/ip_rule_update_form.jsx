import React, { useState } from "react";
import "./form.css";

export const UpdateIPRuleForm = ({ rule, onSubmit, onCancel }) => {
  const [form, setForm] = useState(rule);

  const setOptions = ["Set1", "Set2", "Set3"]; // Replace with dynamic values if needed
  const interfaceOptions = ["eth0", "eth1", "wlan0"]; // Replace with dynamic values if needed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const renderConditionalInput = (type, name, label) => {
    if (type === "IP") {
      return (
        <input
          type="text"
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={label}
        />
      );
    } else {
      return (
        <select name={name} value={form[name]} onChange={handleChange}>
          <option value="">Select Set</option>
          {setOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
  };

  const renderPortInput = (type, name, label) => {
    if (type === "PORT") {
      return (
        <input
          type="number"
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={label}
          min="0"
        />
      );
    } else {
      return (
        <select name={name} value={form[name]} onChange={handleChange}>
          <option value="">Select Set</option>
          {setOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content full-screen-form">
        <h2>Create/Update Custom Rule</h2>
        <form onSubmit={handleSubmit} className="form-grid">

          {/* Source Address Section */}
          <label>Source Address Type</label>
          <select name="SADDR_TYPE" value={form.SADDR_TYPE} onChange={handleChange}>
            <option value="IP">IP</option>
            <option value="Set">Set</option>
          </select>

          <label>Source Address</label>
          {renderConditionalInput(form.SADDR_TYPE, "SADDR", "Source Address")}

          <label>Source Mask</label>
          <input
            type="text"
            name="SMASK"
            value={form.SMASK}
            onChange={handleChange}
            disabled={form.SADDR_TYPE !== "IP"}
            placeholder="Source Mask"
          />

          <label>Source PORT Type</label>
          <select name="SPORT_TYPE" value={form.SPORT_TYPE} onChange={handleChange}>
            <option value="PORT">PORT</option>
            <option value="Set">Set</option>
          </select>

          <label>Source PORT</label>
          {renderPortInput(form.SPORT_TYPE, "SPORT", "Source Port")}

          {/* Destination Address Section */}
          <label>Destination Address Type</label>
          <select name="DADDR_TYPE" value={form.DADDR_TYPE} onChange={handleChange}>
            <option value="IP">IP</option>
            <option value="Set">Set</option>
          </select>

          <label>Destination Address</label>
          {renderConditionalInput(form.DADDR_TYPE, "DADDR", "Destination Address")}

          <label>Destination Mask</label>
          <input
            type="text"
            name="DMASK"
            value={form.DMASK}
            onChange={handleChange}
            disabled={form.DADDR_TYPE !== "IP"}
            placeholder="Destination Mask"
          />

          <label>Destination Port Type</label>
          <select name="DPORT_TYPE" value={form.DPORT_TYPE} onChange={handleChange}>
            <option value="PORT">Port</option>
            <option value="Set">Set</option>
          </select>

          <label>Destination Port</label>
          {renderPortInput(form.DPORT_TYPE, "DPORT", "Destination Port")}

          {/* Remaining Fields */}
          <label>Protocol</label>
          <input
            type="text"
            name="PROTOCOL"
            value={form.PROTOCOL}
            onChange={handleChange}
            placeholder="Protocol"
          />

          <label>Interface</label>
          <select name="INTERFACE" value={form.INTERFACE} onChange={handleChange}>
            <option value="">Select Interface</option>
            {interfaceOptions.map((iface) => (
              <option key={iface} value={iface}>{iface}</option>
            ))}
          </select>

          <label>Rate</label>
          <input
            type="number"
            name="RATE"
            value={form.RATE}
            onChange={handleChange}
            min="0"
            placeholder="Rate"
          />

          <label>Unit</label>
          <select name="UNIT" value={form.UNIT} onChange={handleChange}>
            <option value="Second">Second</option>
            <option value="Minute">Minute</option>
            <option value="Hour">Hour</option>
            <option value="Day">Day</option>
          </select>

          <label>Burst</label>
          <input
            type="number"
            name="BURST"
            value={form.BURST}
            onChange={handleChange}
            min="0"
            placeholder="Burst"
          />

          <label>Action</label>
          <select name="ACTION" value={form.ACTION} onChange={handleChange}>
            <option value="accept">accept</option>
            <option value="reject">reject</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn update-btn">✅ Submit</button>
            <button type="button" onClick={onCancel} className="btn cancel-btn">❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
