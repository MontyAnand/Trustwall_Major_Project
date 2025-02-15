import React from 'react';
import {Chart} from 'react-google-charts';
import {useSocket} from "../Contexts/socketContex";
import { useEffect, useState } from "react";

const DiskInfo=()=>{
    const {socket , socketID} = useSocket();
    const [diskName,setDiskName ] = useState([]);
    const [diskValue, setDiskValue] = useState([]);

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

    // // It has to be received from server-side first place should be the disk name and 2nd one is the actual value 
    // const disk_info=[
    //     ["Disk1",73],
    //     ["Disk2",61],
    //     ["Disk3",57],
    //     ["Disk4",81]
    // ];
    // for(let i=0;i<disk_info.length;i++)
    // {
    //     diskName.push(disk_info[i][0]);
    //     diskValue.push(disk_info[i][1]);
    // }
    const options={
        legend:{
            position: "bottom",
            alignment: "center",
            textStyle:{fontSize: 12, color: "grey"}
        },
        colors:["#493D9E","#B2A5FF"],
        is3D: true,
        chartArea: { width: "75%", height: "75%" },
        pieStartAngle: 10
    };

    let data=[];

    return (
        <div className='Disk_container'>
            <h2>Disk Information</h2>
            <div className='Disk_inner_container'>
                {diskName.map((row,rowIndex)=>(
                    data =[
                        ["disk_usage","space"],
                        ["Used",diskValue[rowIndex]],
                        ["Free",100-diskValue[rowIndex]]
                    ],
                    <div className='Disk_box'>
                        <p>{row}</p>
                        <Chart chartType='PieChart' data={data} options={options} width={"100%"} height={"200px"}/>
                    </div>
                ))}
            </div>
        </div>
        // </div>
    );
}

export default DiskInfo;