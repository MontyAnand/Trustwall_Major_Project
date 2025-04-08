import React from 'react';
import { Chart } from 'react-google-charts';
import { useSocket } from "../Contexts/socketContex";
import { useEffect, useState } from "react";

const MemoryInfo = () => {
    const { socket, socketID } = useSocket();
    const [memoryUsage, setMemoryUsage] = useState(0);
    const [data, setData] = useState([
        ["memoryUsage", "percentage"],
        ["Used Memory", 0],
        ["Free Memory", 100]
    ]);

    useEffect(() => {
        if (socket) {
            socket.emit("getRAMInfo");
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        socket.on('ram-info', (data) => {
            console.log(data);
            setMemoryUsage(data);
            setData(
                [
                    ["memoryUsage", "percentage"],
                    ["Used Memory", memoryUsage],
                    ["Free Memory", 100 - memoryUsage]
                ]
            );
        });
    }, [data, memoryUsage, socket]);

    const options = {
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: { fontSize: 16, color: "grey" }
        },
        colors: ["#2E5077", "#4DA1A9"],
        is3D: true,
        chartArea: { width: "75%", height: "75%" },
        pieStartAngle: 10
    };

    return (
        <div id="Mem_container" className='Mem_container'>
            <div className='mem_text'> <h1>Memory Usage</h1></div>
            <div className="mem_piechart" >
                <Chart chartType='PieChart' data={data} options={options} width={"120%"} height={"300px"} />
            </div>
        </div>
    );
}

export default MemoryInfo;