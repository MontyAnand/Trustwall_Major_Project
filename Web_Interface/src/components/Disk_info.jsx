import React from 'react';
import {Chart} from 'react-google-charts';

const DiskInfo=()=>{
    // It has to be received from server-side first place should be the disk name and 2nd one is the actual value 
    const disk_info=[
        ["Disk1",73],
        ["Disk2",61],
        ["Disk3",57],
        ["Disk4",81]
    ];

    let disk_name =[];
    let disk_value =[];
    for(let i=0;i<disk_info.length;i++)
    {
        disk_name.push(disk_info[i][0]);
        disk_value.push(disk_info[i][1]);
    }
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
                {disk_name.map((row,rowIndex)=>(
                    data =[
                        ["disk_usage","space"],
                        ["Used",disk_value[rowIndex]],
                        ["Free",100-disk_value[rowIndex]]
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