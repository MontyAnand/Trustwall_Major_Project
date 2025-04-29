import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "./interfaceForm.css";
import Sidebar from "../Sidebar";

const HomePage = () => {
  const [interfaces, setInterfaces] = useState([]);

  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete  this interface?`)) {
      axios.delete(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces/${id}`).then(() => {
        setInterfaces(interfaces.filter((intf) => intf.id !== id));
      });
    }
  };

  const handleStart = (id) => {
    if (window.confirm(`Are you sure you want to start SURICATA service on this interface?`)) {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interface/start/${id}`).then((res) => {
        setInterfaces(res.data);
      });
    }
  };

  const handleRestart = (id) => {
    if (window.confirm(`Are you sure you want to restart SURICATA service on this interface?`)) {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interface/restart/${id}`).then((res) => {
        setInterfaces(res.data);
      });
    }
  };

  const handleStop = (id) => {
    if (window.confirm(`Are you sure you want to stop SURICATA service on this interface?`)) {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interface/stop/${id}`).then((res) => {
        setInterfaces(res.data);
      });
    }
  };


  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces`).then((res) => {
      setInterfaces(res.data);
    });
  }, []);

  return (

    <>
      <Sidebar/>

      <Navbar />

      <div className="suricata-container">
        <h2 style={{textAlign:'center',marginBottom:'10px'}}>Suricata Interfaces</h2>
        <table>
          <thead>
            <tr>
              <th>Interface</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((intf) => (
              <tr key={intf.id}>
                <td>{intf.interface}</td>
                <td>{intf.status}</td>
                <td>{intf.description}</td>
                <td>
                  <button onClick={() => navigate(`/suricata/edit/${intf.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(intf.id)} style={{ marginLeft: "8px" }}>Delete</button>
                  <button onClick={() => handleStart(intf.id)} disabled={interfaces[interfaces.findIndex((i) => i.id === intf.id)].enableStart} style={{ marginLeft: "8px" }}>Start</button>
                  <button onClick={() => handleRestart(intf.id)} disabled={interfaces[interfaces.findIndex((i) => i.id === intf.id)].enableRestart} style={{ marginLeft: "8px" }}>Restart</button>
                  <button onClick={() => handleStop(intf.id)} disabled={interfaces[interfaces.findIndex((i) => i.id === intf.id)].enableStop} style={{ marginLeft: "8px" }}>Stop</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate("/suricata/add")} >+ Add</button>
      </div>
    </>
  );
};

export default HomePage;
