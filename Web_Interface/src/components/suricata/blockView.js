import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../Sidebar";
import './interfaceForm.css';

const BlocksViewForm = () => {
    const [formData, setFormData] = useState({
        blockInstanceView: "",
        enablerefresh: false,
        numBlocksToDisplay: 250
    });

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/blocklogs`)
            .then((res) => {
                console.log("Response:", res.data);
                setLogs(res.data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });

        return () => {

        };
    }, []);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/block_settings`).then((res) => res.data !== "" ? setFormData(res.data) : "");
    }, []);

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
        axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/block_settings`, formData)
            .then((res) => {
                console.log("Response:", res.data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });

        axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/blocklogs`)
            .then((res) => {
                console.log("Response:", res.data);
                setLogs(res.data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    };
    return (
        <>
          {/* <Sidebar/> */}
            <form onSubmit={handleSubmit}>
                {/* Alert view settings */}
                <h1>Block Log View Settings</h1>
                <div className='section'>
                    <select name="blockInstanceView" value={formData.blockInstanceView} onChange={handleChange} required>
                        <option value="">--- select a interface ---</option>
                        <option value={"WAN"}>WAN</option>
                        <option value={"LAN"}>LAN</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>Choose which instance alerts you want to inspect</label>
                </div>

                <div className='section'>
                    <label>Save or Remove Logs&emsp;&emsp;</label>
                    <button type='button'>&#11015;Download</button>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&emsp;All alerts log files for selected interface will be downloaded&emsp;&emsp;</label>
                    <button type='button' style={{ backgroundColor: "red" }}>&#128465; Clear</button>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&emsp;Clear the currently active Alerts log file</label>
                </div>

                <div className='section'>
                    <label>Save Settings&emsp;&emsp;</label>
                    <button type='submit'>&#128190; Save</button>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&emsp;Save auto-refresh and view settings&emsp;</label>
                    <input type='checkbox' name='enablerefresh' checked={formData.enablerefresh} onChange={handleChange} />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is OFF.&emsp;&emsp;&emsp;</label>
                    <input type='number' name='numBlocksToDisplay' value={formData.numBlocksToDisplay} onChange={handleChange} />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&emsp;Number of alerts to display.Default is 250</label>
                </div>
            </form >

            {/* Alert Log view filter */}
            <h1>Block Log View filter</h1>

            {/* Alert Entries*/}
            <h1>Last {formData.numBlocksToDisplay} Alert Entries. (Most recent entries are listed first)</h1>

            <div className="logs-container">
                {/* <h2>Suricata Log Viewer</h2> */}
                <table>
                    <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>Date</th>
                            <th>Action</th>
                            <th>Protocol</th>
                            <th>Source IP</th>
                            <th>Source Port</th>
                            <th>Destination IP</th>
                            <th>Destination Port</th>
                            <th>Description</th>
                            <th>GID:SID:REV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{log.date}</td>
                                <td>{log.action}</td>
                                <td>{log.protocol}</td>
                                <td>{log.sourceIP}</td>
                                <td>{log.sourcePort}</td>
                                <td>{log.destinationIP}</td>
                                <td>{log.destinationPort}</td>
                                <td>{log.description}</td>
                                <td>{log.gidSidRev}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
export default BlocksViewForm;