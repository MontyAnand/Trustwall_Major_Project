import React, { useState } from "react";
import axios from "axios";
import './interfaceForm.css';
import Navbar from "./navbar";
import Sidebar from "../Sidebar";

const GlobalSettingsForm = () => {
    const [formData, setFormData] = useState({
        // enableETOpenRules: false,
        // enableCustomETOpenRulesURL: false,
        // customETOpenRulesURL: '',
        // feodoTrackerBotnet: false,
        // abuseSSLBlacklist: false,
        // hideDeprecatedRules: false,
        updateInterval: 1,
        updateTime: "12:38",
        liveRuleSwapUpdate: false,
        // removeBlockedHostsInterval: "",
        // logToSystemLog: false,
        // keepSuricataAfterReinstall: false,
        // clearBlockedHostsAfterReinstall: false,
        // updateNotifications: false,
        // ruleCategoriesUpdate: false
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
        axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/update-schedule`, formData).then((res) => console.log(res.data));
        alert("Update Scheduler set!");
    };
    return (
        <>
            <Sidebar/>
            <Navbar />
            <div className="suricata-container">
            <form onSubmit={handleSubmit}>
                {/* rule type settings glabally */}
                {/* <h1>Please Choose the Type of Rules you want to download</h1>
                <div className="section">
                    <label>Install ETOpen Emerging Threats rules&emsp;&emsp;</label>
                    <input type="checkbox" name="enableETOpenRules" checked={formData.enableETOpenRules} onChange={handleChange} required />
                    <label>&ensp;ETOpen is free open source set of  Suricata rules whose coverage is more limited than ETPro&emsp;&emsp;</label>
                    <input type="checkbox" name="enableCustomETOpenRulesURL" checked={formData.enableCustomETOpenRulesURL} onChange={handleChange} />
                    <label>&ensp;Use a custom URL for ETOpen rule downloads</label>

                    {formData.enableCustomETOpenRulesURL &&
                        <div className="section">
                            <input type="text" name="CustomETOpenRulesURL" value={formData.customETOpenRulesURL} onChange={handleChange} placeholder="Write down the custom URL for ETOpen rules here" required />
                        </div>
                    }
                     <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Install Snort GPLv2 Community rules&emsp;&emsp;</label>
                    <input type="checkbox" name="enableSnortCommunityRules" checked={formData.enableSnortCommunityRules} onChange={handleChange} required />
                    <label>&ensp;The snort Community Ruleset is a GPLv2 Talos-certified ruleset that is distributed free of charge without any Snort Subscriber License restrictions&emsp;&emsp;</label>
                    <input type="checkbox" name="enableCustomSnortCommunityRulesURL" checked={formData.enableCustomSnortCommunityRulesURL} onChange={handleChange} />
                    <label>&ensp;Use a custom URL for Snort GPLv2 rule downloads</label>

                    {formData.enableCustomSnortCommunityRulesURL &&
                        <div className="section">
                            <input type="text" name="CustomSnortCommunityRulesURL" value={formData.customSnortCommunityRulesURL} onChange={handleChange} placeholder="Write down the custom URL for SnortCommunity rules here" required />
                        </div>
                    }
                     <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Install Feodo Tracker Botnet C2 IP rules&emsp;&emsp;</label>
                    <input type="checkbox" name="feodoTrackerBotnet" checked={formData.feodoTrackerBotnet} onChange={handleChange} required />
                    <label>&ensp;The Feodo Botnet C2 IP Ruleset contains Dridex and Emotet/Heodo botnet command and control servers (C & Cs) tracked by Feodo Tracker &emsp;&emsp;</label>                
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                    </div>

                <div className="section">
                    <label>Install ABUSE.ch SSL Blacklist rules&emsp;&emsp;</label>
                    <input type="checkbox" name="abuseSSLBlacklist" checked={formData.abuseSSLBlacklist} onChange={handleChange} required />
                    <label>&ensp;The ABUSE.ch SSL Blacklist Ruleset contains the SSL cert fingerprints of all SSL certs blacklisted by ABUSE.ch &emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Hide Deprecated Rules&emsp;&emsp;</label>
                    <input type="checkbox" name="hideDeprecatedRules" checked={formData.hideDeprecatedRules} onChange={handleChange} required />
                    <label>&ensp;Hide deprecated rules categories in GUI and removethem from the configuration.Default is Not checked&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div> */}

                {/* Rules Update Settings */}
                <h1>Rules Update Settings</h1>
                <div className="suricata_section">
                    <label>Update Interval(in hours)&emsp;&emsp;</label>
                    <select name="updateInterval" value={formData.updateInterval} onChange={handleChange} >
                        <option value={"NEVER"}>NEVER</option>
                        <option value={1}>1 minutes</option>
                        <option value={12 * 60}>12 hours</option>
                        <option value={24 * 60}>24 hours</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>Please select the interval for rule updates.Choosing NEVER disables auto-updates.<span style={{ color: 'blue', fontWeight: 'bolder' }}>Hint:</span>In most cases ,every 12 hours is a good choice.</label>
                </div>

                <div className="suricata_section">
                    <label>Update Start Time(in hours)&emsp;&emsp;</label>
                    <input type="time" name="updateTime" value={formData.updateTime} onChange={handleChange} placeholder="time format HH:MM"></input>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>Enter the rule update start time in 24-hour format (HH:MM).Default is 00:00 hours value.Rules will update at the interval chosen above starting at the time specified here.For example, using a start time of 00:08 and choosing 12 Hours for the interval,the rules will update at 00:08 and 12;08 each day.</label>
                </div>

                <div className="suricata_section">
                    <label>Live Rule Swap on Updates&emsp;&emsp;</label>
                    <input type="checkbox" name="liveRuleSwapUpdate" checked={formData.liveRuleSwapUpdate} onChange={handleChange}  />
                    <label>&ensp;Enable "Live Swap" reload of the rules after downloading an update.Default is Not Checked&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>When enabled.Suricata will perform a live load of the new rules foloowing an update instead of hard restart.Uncheck this option to perform a hard reset of all suricata instances following an update.</label>
                </div>

                {/* General Settings */}
                {/* <h1>General Settings</h1>

                <div className="section">
                    <label>Remove Blocked Hosts Interval</label>
                    <select name="removeBlockedHostsInterval" value={formData.removeBlockedHostsInterval} onChange={handleChange}>
                        <option value={"NEVER"}>NEVER</option>
                        <option value={"1"}>ONE HOUR</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                    
                </div>

                <div className="section">
                    <label>Log to System Log&emsp;&emsp;</label>
                    <input type="checkbox" name="logToSystemLog" checked={formData.logToSystemLog} onChange={handleChange} required />
                    <label>&ensp;Copy Suricata message to the firewall system log&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Keep Suricata Settings After reinstall&emsp;&emsp;</label>
                    <input type="checkbox" name="keepSuricataAfterReinstall" checked={formData.keepSuricataAfterReinstall} onChange={handleChange} required />
                    <label>Settings will not be removed during package reinstallations&ensp;&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>

                <div className="section">
                    <label>Clear Blocked Hosts After Reinstall&emsp;&emsp;</label>
                    <input type="checkbox" name="clearBlockedHostsAfterReinstall" checked={formData.clearBlockedHostsAfterReinstall} onChange={handleChange} required />
                    <label>Click to clear all blocked hosts added by Suricata when removing the package.Default is checked&ensp;&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div> */}

                {/* Notifications */}
                {/* <h1>Notifications</h1>
                <div className="section">
                    <label>Update&emsp;&emsp;</label>
                    <input type="checkbox" name="updatenotifications" value={formData.updateNotifications} onChange={handleChange} required />
                    <label>Rule update notifications.&ensp;&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div>
                <div className="section">
                    <label>Rule Categories&emsp;&emsp;</label>
                    <input type="checkbox" name="ruleCategoriesUpdate" value={formData.ruleCategoriesUpdate} onChange={handleChange} required />
                    <label>Send notifications when new rule categories appear.&ensp;&emsp;&emsp;</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}></label>
                </div> */}
                {/* Submit button */}
                <div className="suricata_section">
                    <button type="submit">Save</button>
                </div>

            </form>
            </div>
        </>
    );
};

export default GlobalSettingsForm;