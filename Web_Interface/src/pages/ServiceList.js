import React, { useEffect, useState } from "react";
import "./ServiceList.css";
import { useSocket } from "../Contexts/socketContex";
import Sidebar from "../components/Sidebar";

const ServiceTable = () => {
  const [services, setServices] = useState([]);

  const { socket } = useSocket();

  // Ensure service-list-request is called whenever the component is mounted/reloaded
  useEffect(() => {
    if (socket) {
      socket.emit("service-list-request");
    }
  }, [socket]); // Runs only when `socket` is available or changes

  useEffect(() => {
    if (!socket) return;

    socket.on("service-list", (data) => {
      setServices(data);
    });

    return () => {
      socket.off("service-list");
    };
  }, [socket]);

  // Button handlers
  const handleStart = (service) => {
    socket?.emit("update-service-status", { service, operation: 0 });
    
  };

  const handleStop = (service) => {
    socket?.emit("update-service-status", { service, operation: 1 });
    socket?.emit("service-list-request");
  };

  const handleRestart = (service) => {
    socket?.emit("update-service-status", { service, operation: 2 });
    socket?.emit("service-list-request");
  };

  const handleEnable = (service) => {
    socket?.emit("update-service-status", { service, operation: 3 });
    socket?.emit("service-list-request");
  };

  const handleDisable = (service) => {
    socket?.emit("update-service-status", { service, operation: 4 });
    socket?.emit("service-list-request");
  };

  return (
    <>
      <Sidebar/>
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="service-table-heading">
            <th>Service</th>
            <th>Active</th>
            <th>Status</th>
            <th>Start</th>
            <th>Stop</th>
            <th>Restart</th>
            <th>Enable</th>
            <th>Disable</th>
          </tr>
        </thead>
        <tbody>
          {services.map((item, index) => (
            <tr key={index}>
              <td>{item.service}</td>
              <td>
                <span className={`status-badge ${item.isActive ? "status-active" : "status-inactive"}`}>
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{item.status}</td>
              <td>
                <button className="action-btn start-btn" onClick={() => handleStart(item.service)}>
                  Start
                </button>
              </td>
              <td>
                <button className="action-btn stop-btn" onClick={() => handleStop(item.service)}>
                  Stop
                </button>
              </td>
              <td>
                <button className="action-btn restart-btn" onClick={() => handleRestart(item.service)}>
                  Restart
                </button>
              </td>
              <td>
                <button className="action-btn enable-btn" onClick={() => handleEnable(item.service)}>
                  Enable
                </button>
              </td>
              <td>
                <button className="action-btn disable-btn" onClick={() => handleDisable(item.service)}>
                  Disable
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ServiceTable;
