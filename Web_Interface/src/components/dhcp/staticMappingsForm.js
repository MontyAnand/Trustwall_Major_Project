import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../suricata/interfaceForm.css';
const StaticMappingsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // for edit

    const [formData, setFormData] = useState({
        macAddress: "",
        // clientIdentifier: "",
        ipAddress: "",
        hostname: "",
        description: ""
    });

    useEffect(() => {
        if (id) {
            axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/staticMappings/${id}`).then((res) => {
                setFormData(res.data);
            });
        }
    }, []);

    const fetchMyMacAddress = (e) => {
        axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/staticMappings/myMacAddress`).then((res) => {
            setFormData((prevData) => ({
                ...prevData,
                macAddress:res.data.macAddress ,
            }));
        });
    };

    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;

        let newValue;

        switch (type) {
            case 'checkbox':
                newValue = checked;
                break;
            case 'file':
                newValue = files; // Or files[0] if single file
                break;
            default:
                newValue = value;
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            axios.put(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/staticMappings/${id}`, formData).then(() => navigate("/dhcp"));
        } else {
            axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/staticMappings`, formData)
                .then((res) => {
                    console.log(res.data.message);
                })
                .then(() => navigate("/dhcp"));
        }
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <h1>Static DHCP Mapping on LAN</h1>
                <div className='section'>
                    <label><b>DHCP Backend : &emsp;&emsp;</b></label>
                    <input type="text" value={"ISC DHCP"} readOnly />
                </div>
                <div className="section">
                    <label><b>MAC Address: </b>&emsp;&emsp;</label>
                    <input type="text" name="macAddress" value={formData.macAddress} onChange={handleChange} pattern='^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$' required />
                    <button type="button" onClick={fetchMyMacAddress} >Copy My MAC</button>
                    <br />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>MAC address of the client to match (6 hex octets separted by colons)</label>
                </div>
                {/* <div className="section">
                    <label><b>Client Identifier: </b>&emsp;&emsp;</label>
                    <input type="text" name="clientIdentifier" value={formData.clientIdentifier} onChange={handleChange} />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&emsp;An optional identifier to match based on the value sent by the client (RFC 2132)</label>
                </div> */}
                <div className="section">
                    <label><b>IP Address: </b>&emsp;&emsp;</label>
                    <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} pattern='^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$' required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}><p>IPv4 address to assign this client.</p><br />
                        <p>Address must be outside of any defined pools /If no IPv4 address is given ,one will be dynamically allocated from a pool.</p>
                        <p>The same IP address may be assigned to multiple mappings</p>
                    </label>
                </div>
                <div className="section">
                    <label><b>Hostname: </b>&emsp;&emsp;</label>
                    <input type="text" name="hostname" value={formData.hostname} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>Name of the client host without the domain part.</label>
                </div>
                <div className="section">
                    <label><b>Description: </b>&emsp;&emsp;</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>A description for administrative reference (not parsed).</label>
                </div>
                <div className="section">
                    <button type="submit">{id ? "Update" : "Add"}</button>
                </div>
            </form>
        </div>
    );
};

export default StaticMappingsForm;