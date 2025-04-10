import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar";
import './interfaceForm.css';

const LogViewForm = () => {
    const [logInstanceView, setLogInstanceView] = useState('');
    const [logFileView, setLogFileView] = useState('');
    const [filecontent, setFileContent] = useState('');
    const [files, setFiles] = useState([]);
    const [rows, setRows] = useState(20);
    const [cols, setCols] = useState(80);

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadFile = async () => {
            try {
                const response = await axios.get('http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/file', {
                    params: { path: logFileView }
                });
                setFileContent(response.data);
            } catch (err) {
                console.error('Error loading file:', err);
                setFileContent('Error loading file. Check the console.');
            }
        };
        loadFile();
    };
    useEffect(() => {
        function updateSize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Estimate cols/rows based on screen size
            setCols(Math.floor(width / 10));  // each character ~10px
            setRows(Math.floor(height / 25)); // each row ~25px tall
        }

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <>
            {/* <Sidebar/> */}
            <form onSubmit={handleSubmit}>
                {/* Alert view settings */}
                <h1>Logs Browser Selection</h1>
                <div className='section'>
                    <label>Instance to View</label>
                    <select name="logInstanceView" value={logInstanceView} onChange={(e) => {
                        setLogInstanceView(e.target.value);

                        // Fetch list of files from backend
                        axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/files`)
                            .then(response => {
                                setFiles(response.data);
                            })
                            .catch(error => {
                                console.error('Error fetching files:', error);
                            });
                    }} required>
                        <option value="">--- select a interface ---</option>
                        <option value={"WA"}>WAN</option>
                        <option value={"LAN"}>LAN</option>
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>Choose which instance alerts you want to inspect</label>
                </div>

                <div className='section'>

                    <label>File to View</label>
                    <select name="logFileView" value={logFileView} onChange={(e) => setLogFileView(e.target.value)} required>
                        <option value="">--- select a file ---</option>
                        {files.map((file, idx) => (
                            <option key={idx} value={file}>{file}</option>
                        ))}
                    </select>
                    <label style={{ fontSize: '0.85em', color: '#777' }}>Choose which instance alerts you want to inspect</label>
                </div>

                <button type='submit'>&#x1F501; Load</button><br/><br/>
            </form >

            {/* Logs content */}
            <div className='section'>
                <h1>Log Contents</h1>
                <textarea
                    rows={rows}
                    cols={cols}
                    value={filecontent}
                    readOnly
                    style={{ fontFamily: 'monospace', whiteSpace: 'pre' , width:'100%' }}
                />
            </div>
        </>
    );
};
export default LogViewForm;