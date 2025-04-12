import React, { useState } from "react";
import axios from 'axios';
import "./form.css";

// Basic IPv4 validation
const isValidIPv4 = (ip) => {
  const regex = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
  return regex.test(ip);
};

// Convert dotted IP to integer
const ipToInt = (ip) =>
  ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

// Check if IP is within subnet defined by netmask
const isIpInSubnet = (ip, netmask) => {
  const ipInt = ipToInt(ip);
  const maskInt = ipToInt(netmask);
  const networkInt = ipInt & maskInt;
  return (ipInt & maskInt) === networkInt;
};

export const VPNConfigurationForm = () => {
  const [formData, setFormData] = useState({ ip: "", netmask: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ip, netmask } = formData;

    if (!isValidIPv4(ip)) {
      alert("Invalid IP address.");
      return;
    }

    if (!isValidIPv4(netmask)) {
      alert("Invalid netmask.");
      return;
    }

    if (!isIpInSubnet(ip, netmask)) {
      alert("IP does not fall under the given netmask.");
      return;
    }

    // alert("✅ IP and Netmask are valid and compatible.");
    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/vpnServerSetup`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Success:', response.data);
      alert('Configuration Completed...');
    } catch (error) {
      console.error('Error:', error);
      alert('Error while VPN Configuration');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="simple-form">
      <h3>VPN Configuration</h3>

      <label>IP Address</label>
      <input
        type="text"
        name="ip"
        value={formData.ip}
        onChange={handleChange}
        placeholder="e.g. 192.168.0.10"
        required
      />

      <label>Netmask</label>
      <input
        type="text"
        name="netmask"
        value={formData.netmask}
        onChange={handleChange}
        placeholder="e.g. 255.255.255.0"
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};
