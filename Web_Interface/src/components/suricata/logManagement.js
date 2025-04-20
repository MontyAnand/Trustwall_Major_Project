import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import './interfaceForm.css';


const LogManagement = () => {
    const [formData, setFormData] = useState({
        enableautoLogMgmt: false,
        enableSuricataLogsOnPackageUninstall:false,
        enableLogDirectorySizeLimit:false,
        LogDirectorySize:"",
        alertMaxSize:"",
        alertRetention:"",
        blockMaxSize:"",
        blockRetention:"",
        eveJson:"",
        eveJsonRetention:"",
        sid_changesMaxSize:"",
        sid_changesRetention:"",
        statsMaxSize:"",
        statsRetention:"",
        tlsMaxSize:"",
        tlsRetention:"",
        capturedFilesStorageLimit:"",
        capturedFilesRetentionPeriod:"",
        capturedTlsCertRetentionPerion:"",
        packetcapturedFilesRetentionPeriod:""
    });

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
       
    };


    return (
        <>
            <Navbar />

            <form onSubmit={handleSubmit}>
                <h1>General Settings</h1>

                <div className="section">
                    <label>Auto Log Management&emsp;&emsp;</label>
                    <input type="checkbox" name="enableautoLogMgmt" checked={formData.enableautoLogMgmt} onChange={handleChange} required />
                    <label>&ensp;Enable automatic unattended management of Suricata logs using parameters. Default is checked.</label>
                </div>

                <div className="section">
                    <label>Remove Suricata Logs On Package Uninstall&emsp;&emsp;</label>
                    <input type="checkbox" name="enableSuricataLogsOnPackageUninstal" checked={formData.enableSuricataLogsOnPackageUninstal} onChange={handleChange} required />
                    <label>&ensp;Suricata log files will be removed when the Suricata package is uninstalled. Default is not Checked.</label>
                </div>

                <h1>Log Directory Size Limit</h1>

                <div className="section">
                    <label>Log Directory Size Limit&emsp;&emsp;</label>
                    <input type="checkbox" name="enableLogDirectorySizeLimit" checked={formData.enableLogDirectorySizeLimit} onChange={handleChange} required />
                    <label>&ensp;Enable Directory Size Limit</label>
                </div>

                <div className="section">
                    <label>Log Directory Size Limit&emsp;&emsp;</label>
                    <input type="number" name="LogDirectorySize" value={formData.LogDirectorySize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;This settings imposes a hard-limit on the combined log directory size of all Suricata interfaces. When the size limit set is reached, rotated logs for all interfaces will be removed, and any active logs pruned to zero-length.(default is 20% of available free disk space)</label>
                </div>

                <h1>Log Size and Retention Limits</h1>

                <div className="section">
                    <label>Alert&emsp;&emsp;</label>
                    <input type="number" name="alertMaxSize" value={formData.alertMaxSize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 500 kB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="alertRetention" value={formData.alertRetention} onChange={handleChange} required >
                        <option value={"14"}>14 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 14 DAYS.<br/><br/>Suricata alerts and event details.</label>
                </div>

                <div className="section">
                    <label>Block&emsp;&emsp;</label>
                    <input type="number" name="blockMaxSize" value={formData.blockMaxSize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 500 kB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="blockRetention" value={formData.blockRetention} onChange={handleChange} required >
                        <option value={"14"}>14 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 14 DAYS.<br/><br/>Suricata blocked IPs and event details.</label>
                </div>

                <div className="section">
                    <label>Eve-json&emsp;&emsp;</label>
                    <input type="number" name="eveJson" value={formData.eveJson} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 500 kB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="eveJsonRetention" value={formData.eveJsonRetention} onChange={handleChange} required >
                        <option value={"7"}>7 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 7 DAYS.<br/><br/>Eve-JSON (Javascript Object Notation) data.</label>
                </div>

                <div className="section">
                    <label>alert&emsp;&emsp;</label>
                    <input type="number" name="httpMaxSize" value={formData.httpMaxSize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 1 MB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="alertRetention" value={formData.alertRetention} onChange={handleChange} required >
                        <option value={"7"}>7 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 7 DAYS.<br/><br/>Captured HTTP events and session info.</label>
                </div>

                <div className="section">
                    <label>alert&emsp;&emsp;</label>
                    <input type="number" name="sid_changesMaxSize" value={formData.sid_changesMaxSize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 250 KB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="sid_changesRetention" value={formData.sid_changesRetention} onChange={handleChange} required >
                        <option value={"14"}>14 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 14 DAYS.<br/><br/>Log of SID changes made by SID Mgmt conf files.</label>
                </div>

                <div className="section">
                    <label>Stats&emsp;&emsp;</label>
                    <input type="number" name="statsMaxSize" value={formData.statsMaxSize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 500 KB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="statsRetention" value={formData.statsRetention} onChange={handleChange} required >
                        <option value={"14"}>14 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 14 DAYS.<br/><br/>Suricata performance statistics.</label>
                </div>

                <div className="section">
                    <label>Stats&emsp;&emsp;</label>
                    <input type="number" name="tlsMaxSize" value={formData.tlsMaxSize} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Max Size. Default is 500 KB.</label>
                    <br/><br/>
                    <label>Retention&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="tlsRetention" value={formData.tlsRetention} onChange={handleChange} required >
                        <option value={"14"}>14 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Default is 14 DAYS.<br/><br/>SMTP TLS handshake details.</label>
                </div>

                <div className='section'>
                    <label>Settings will be ignored for any log in the list above not enabled on the Interface Settings tab. When a log reaches the Max Size limit, it will be rotated and tagged with a timestamp. The Retention period determines how long rotated logs are kept before they are automatically deleted.</label>
                </div>

                <div className="section">
                    <label>Captured Files Storage limit&emsp;&emsp;</label>
                    <input type="number" name="capturedFilesStorageLimit" value={formData.capturedFilesStorageLimit} onChange={handleChange} required />
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;</label>
                </div>

                <div className="section">
                    <label>Captured Files Retention Period&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="capturedFilesRetentionPeriod" value={formData.capturedFilesRetentionPeriod} onChange={handleChange} required >
                        <option value={"7"}>7 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Captured TLS Certs  Retention Period&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="capturedTlsCertRetentionPeriod" value={formData.capturedTlsCertRetentionPeriod} onChange={handleChange} required >
                        <option value={"7"}>7 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Packet Capture Files Retention Period&emsp;&emsp;</label>
                    <br/><br/>
                    <select  name="packetcapturedFilesRetentionPeriod" value={formData.packetcapturedFilesRetentionPeriod} onChange={handleChange} required >
                        <option value={"7"}>7 DAYS</option>
                        <option value={"25"}>25 DAYS</option>
                        <option value={"60"}>60 DAYS</option>
                        <option value={"90"}>90 DAYS</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className='section'>
                    <button type='submit'>&#128190; Save</button>
                </div>
            </form>
        </>
    );
};

export default LogManagement;