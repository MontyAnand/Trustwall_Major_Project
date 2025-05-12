import React from 'react';
import { Chart } from 'react-google-charts';
import { useSocket } from "../Contexts/socketContex";
import { useEffect, useState } from "react";

const DiskInfo = () => {
    const { socket, socketID } = useSocket();
    const [diskName, setDiskName] = useState([]);
    const [diskValue, setDiskValue] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.emit("getDiskInfo");
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on("disk-info", (disks) => {
            console.log(disks);

            // Extract names and values efficiently
            const names = disks.map((disk) => disk.path);
            const values = disks.map((disk) => disk.used);

            setDiskName(names);
            setDiskValue(values);
        });

        return () => {
            socket.off("disk-info");
        };
    }, [socket]);

    const options = {
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: { fontSize: 12, color: "grey" }
        },
        colors: ["#493D9E", "#B2A5FF"],
        is3D: true,
        chartArea: { width: "75%", height: "75%" },
        pieStartAngle: 10,
        backgroundColor: "#12121C"
    };

    let data = [];

    return (
        <div id="Disk_container" className='Disk_container'>
            <h1>Disk Information</h1>
            <div style={{width:'100%'}} className='Disk_inner_container'>
                {diskName.map((row, rowIndex) => (
                    data = [
                        ["disk_usage", "space"],
                        ["Used Space", diskValue[rowIndex]],
                        ["Free Space", 100 - diskValue[rowIndex]]
                    ],
                    <div className='Disk_box'>
                        <p>{row}</p>
                        <Chart chartType='PieChart' data={data} options={options} width={"100%"} />
                    </div>
                ))}
            </div>
        </div>
        // </div>
    );
}

export default DiskInfo;