import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../pages/dhcp_configuration.css';

const StaticMappings = () => {
    const navigate = useNavigate();

    const [staticMappingEntries, setStaticMappingEntries] = useState([]);

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete  this interface?`)) {
            axios.delete(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/staticMappings/${id}`).then(() => {
                setStaticMappingEntries(staticMappingEntries.filter((smp) => smp.id !== id));
            });
        }
    };

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/staticMappings`).then((res) => {
            setStaticMappingEntries(res.data);
        });
    }, []);

    return (
        <>
            <div className='static-mapping-container'>
                <h1 style={{ textAlign: 'left' }}>DHCP Static Mappings</h1>
                <table>
                    <thead>
                        <tr>
                            <th>MAC address</th>
                            <th>IP address</th>
                            <th>Hostname</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staticMappingEntries.map((smp) => (
                            <tr key={smp.id}>
                                <td>{smp.macAddress}</td>
                                <td>{smp.ipAddress}</td>
                                <td>{smp.hostname}</td>
                                <td>{smp.description}</td>
                                <td>
                                <button onClick={() => navigate(`/dhcp/static-mappings/edit/${smp.id}`)}>Edit</button>
                                <button onClick={() => handleDelete(smp.id)} style={{ marginLeft: "8px" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => navigate("/dhcp/static-mappings/add")} >+ Add Static Mapping</button>
            </div>
        </>
    );
};

export default StaticMappings;