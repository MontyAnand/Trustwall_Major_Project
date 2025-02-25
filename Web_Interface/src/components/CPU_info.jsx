import React, { useEffect, useState } from "react";
import { useSocket } from "../Contexts/socketContex";

const CPUInfo = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on("cpu-data", (incomingData) => {
            setData(incomingData);
            setLoading(false);
        });

        return () => {
            socket.off("cpu-data");
        };
    }, [socket]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>CPU Data</h2>
            {data.length > 0 ? (
                <div>
                    {data.map((cpuInfo, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                            <h3>CPU: {cpuInfo.cpu}</h3>
                            <table border="1">
                                <thead>
                                    <tr>
                                        {Object.keys(cpuInfo).map((key) => (
                                            <th key={key}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {Object.values(cpuInfo).map((val, i) => (
                                            <td key={i}>{val.toString()}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No Data Available</p>
            )}
        </div>
    );
};

export default CPUInfo;
