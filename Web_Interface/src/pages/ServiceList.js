import React from "react";
import { useEffect, useState } from "react";
import "./ServiceList.css";
import { useSocket } from "../Contexts/socketContex";



const ServiceTable = () => {
    const [services, setServices] = useState([
        { service: "cron.service", isActive: 1, status: "running" },
        { service: "apache2.service", isActive: 0, status: "stopped" }
      ]);

    const {socket} = useSocket();
    
    if(socket){
        socket.emit('service-list-request');
    }
    
    useEffect(()=>{
        if (!socket) return;
        socket.on('service-list',(data)=>{
            setServices(data);
        });

        return ()=>{
            socket.off('service-list');
        }
    },[socket]);

    // start/restart button
    const handleStartRestart = (index) => {
      setServices((prevServices) =>
        prevServices.map((service, i) =>
          i === index ? { ...service, isActive: 1, status: "running" } : service
        )
      );
    };

    // enable/diable button
    const handleEnableDisable = (index) => {
      setServices((prevServices) =>
        prevServices.map((service, i) =>
          i === index ? { ...service, isActive: service.isActive ? 0 : 1 } : service
        )
      );
    };

    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Active</th>
              <th>Status</th>
              <th>Start/Restart</th>
              <th>Enable/Disable</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item, index) => (
              <tr key={index}>
                <td>{item.service}</td>
                <td>
                  <span className={`status-badge ${item.isActive === 1 ? "status-active" : "status-inactive"}`}>
                    {item.isActive === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{item.status}</td>
                <td>
                  <button className="action-btn start-btn" onClick={() => handleStartRestart(index)}>
                    {item.status === "running" ? "Restart" : "Start"}
                  </button>
                </td>
                <td>
                  <button className="action-btn enable-btn" onClick={() => handleEnableDisable(index)}>
                    {item.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default ServiceTable;
