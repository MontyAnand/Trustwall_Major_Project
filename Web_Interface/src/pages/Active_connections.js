import React from "react";
import { useSocket } from "../Contexts/socketContex";
import { useEffect, useState } from "react";
import './Active_connections.css';
import Sidebar from "../components/Sidebar";

const ActiveConnections = () => {

    const [connectionList, setConnectionList] = useState([]);
    const { socket, socketID } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit("getConnectionList");
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        socket.on('connection-list', (connections) => {
            const list = connections.map((connection) => [connection.local_ip, connection.local_port, connection.protocol, connection.remote_ip, connection.remote_port, connection.state]);
            setConnectionList(list);
        })
    }, [socket]);

    return (
        <>
            <Sidebar/>
            <div id="Active_connections_container" className="Active_connections_container">
                <div className="Active_connections_text"><h1>Number of Active Connections</h1></div>
                <div className="Active_connections_table">
                    <table>
                        <thead>
                            <tr className="Active_connections_header">
                                <th>Local IP</th>
                                <th>Local Port</th>
                                <th>Protocol</th>
                                <th>Remote IP</th>
                                <th>Remote Port</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {connectionList.map((row, rowIndex) => (
                                <tr className="Table_row">
                                    {row.map((cell, colIndex) => (
                                        <td className="Table_row_content">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ActiveConnections;