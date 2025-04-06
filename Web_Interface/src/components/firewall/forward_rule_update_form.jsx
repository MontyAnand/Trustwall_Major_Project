import React, { useState } from "react";
import "./form.css";

export const RedirectRuleForm = ({ rule, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(rule);

    const interfaceOptions = ["eth0", "eth1", "wlan0"]; // Replace with real data
    const setOptions = ["Set1", "Set2"]; // Replace with actual set names if available

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
                <h2>Add/Update Redirect Rule</h2>
                <form onSubmit={handleSubmit} className="form-grid">

                    {/* Interface */}
                    <label>Interface</label>
                    <select
                        name="INTERFACE"
                        value={formData.INTERFACE}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Interface</option>
                        {interfaceOptions.map((iface) => (
                            <option key={iface} value={iface}>{iface}</option>
                        ))}
                    </select>

                    {/* Source Address Type */}
                    <label>Source Address Type</label>
                    <select
                        name="SADDR_TYPE"
                        value={formData.SADDR_TYPE}
                        onChange={handleChange}
                    >
                        <option value="IP">IP</option>
                        <option value="SET">SET</option>
                    </select>

                    {/* Source Address */}
                    <label>Source Address</label>
                    {formData.SADDR_TYPE === "IP" ? (
                        <input
                            type="text"
                            name="SADDR"
                            value={formData.SADDR}
                            onChange={handleChange}
                            placeholder="Enter source IP"
                        />
                    ) : (
                        <select
                            name="SADDR"
                            value={formData.SADDR}
                            onChange={handleChange}
                        >
                            <option value="">Select Set</option>
                            {setOptions.map((set) => (
                                <option key={set} value={set}>{set}</option>
                            ))}
                        </select>
                    )}

                    {/* Source Mask */}
                    <label>Source Mask</label>
                    <input
                        type='number'
                        name="SMASK"
                        value={formData.SMASK}
                        onChange={handleChange}
                        placeholder="Enter Source Network Mask"
                        disabled={formData.SADDR_TYPE !== "IP"}
                    />

                    {/* Protocol */}
                    <label>Protocol</label>
                    <input
                        type="text"
                        name="PROTOCOL"
                        value={formData.PROTOCOL}
                        onChange={handleChange}
                        placeholder="e.g. tcp, udp"
                    />

                    {/* Destination Port */}
                    <label>Destination Port</label>
                    <input
                        type="number"
                        name="DPORT"
                        value={formData.DPORT}
                        onChange={handleChange}
                        placeholder="Enter destination port"
                        min="0"
                    />

                    {/* Redirected IP */}
                    <label>Redirected IP</label>
                    <input
                        type="text"
                        name="REDIRECT_IP"
                        value={formData.REDIRECT_IP}
                        onChange={handleChange}
                        placeholder="Enter redirected IP"
                    />

                    {/* Redirected Port */}
                    <label>Redirected Port</label>
                    <input
                        type="number"
                        name="REDIRECT_PORT"
                        value={formData.REDIRECT_PORT}
                        onChange={handleChange}
                        placeholder="Enter redirected port"
                        min="0"
                    />

                    {/* Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="btn update-btn">✅ Submit</button>
                        <button type="button" className="btn cancel-btn" onClick={onCancel}>❌ Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
