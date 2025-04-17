import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import './interfaceForm.css';

const SidManagement = () => {
    const [formData, setFormData] = useState({

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

                <div className='section'>
                    <label>Enable Automatic SID State Management&emsp;&emsp;</label>
                    <input type='checkbox' name='enableSidMgmt' value={formData.enableSidMgmt} onChange={handleChange} ></input>
                    <label>&emsp;Enable Automatic management of rule state and content using SID Management Configuration Lists.Default is Not Checked.</label>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;When checked Suricata will automatically enable/disable/modify text rules upon each update using criteria specified in SID Management Configuration Lists. See the included sample conf lists for usage example.Enter upload existing configurations to the firewall or create new ones by clicking ADD below. </label>
                </div>

                <h1>SID Management Configuration Lists</h1>
                <div className='section'>

                </div>

                <h1>Interface SID Management List Assignments</h1>
                <div className='section'>

                </div>

                <div className='section'>
                    <button type='submit'>&#128190; Save</button>
                </div>
            </form>

        </>
    );
};

export default SidManagement;