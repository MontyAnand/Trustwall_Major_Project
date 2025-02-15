import React from "react";
import {useSocket} from "../Contexts/socketContex";
import { useEffect, useState } from "react";

// Data from Backend

const [connectionList, setConnectionList] = useState([]);
const {socket , socketID} = useSocket();
useEffect(()=>{
    if(!socket) return;
    socket.on('connection-list',(connections)=>{
        const list = connections.map((connection)=>[connection.local_ip,connection.local_port,connection.protocol,connection.remote_ip,connection.remote_port,connection.state]);
        setConnectionList(list);
    })
},[socket]);
const data = [
    ["127.0.0.1",61209,'TCP',"0.0.0.0",0,"LISTEN"],
    ["127.0.0.53",53,'TCP',"0.0.0.0",11,"LISTEN"],
    ["0.0.0.0",8080,'UDP',"0.0.0.0",29,"LISTEN"],
    ["196.73.1.30",8080,'UDP',"0.0.0.0",29,"ESTABLISHED"],
    ["127.0.0.1",61209,'TCP',"0.0.0.0",0,"LISTEN"],
    ["127.0.0.53",53,'TCP',"0.0.0.0",11,"LISTEN"],
    ["0.0.0.0",8080,'UDP',"0.0.0.0",29,"LISTEN"],
    ["196.73.1.30",8080,'UDP',"0.0.0.0",29,"ESTABLISHED"],
    ["127.0.0.1",61209,'TCP',"0.0.0.0",0,"LISTEN"],
    ["127.0.0.53",53,'TCP',"0.0.0.0",11,"LISTEN"],
    ["0.0.0.0",8080,'UDP',"0.0.0.0",29,"LISTEN"],
    ["196.73.1.30",8080,'UDP',"0.0.0.0",29,"ESTABLISHED"],
    ["127.0.0.1",61209,'TCP',"0.0.0.0",0,"LISTEN"],
    ["127.0.0.53",53,'TCP',"0.0.0.0",11,"LISTEN"],
    ["0.0.0.0",8080,'UDP',"0.0.0.0",29,"LISTEN"],
    ["196.73.1.30",8080,'UDP',"0.0.0.0",29,"ESTABLISHED"],
];

const ActiveConnections = ()=>{
    return (
        <>
            <div className="Active_connections_container">
                <div className="Active_connections_text"><h2>Number of Active Connections</h2></div>
                <div className="Active_connections_table">
                    <table>
                        <thead>
                            <tr className="Active_connections_header">
                            <th>Protocol</th>
                            <th>Local IP</th>
                            <th>Local Port</th>
                            <th>Remote IP</th>
                            <th>Remote Port</th>
                            <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex)=>(
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