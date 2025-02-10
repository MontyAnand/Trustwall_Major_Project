import React from 'react';
import { Chart } from 'react-google-charts';


const MemoryInfo=()=>{

    // has to come from the backend side
    const memory_usage = 25;

    const data=[
        ["memory_usage","percentage"],
        ["Used",memory_usage],
        ["Free" , 100-memory_usage]
    ];

    const options={
        legend:{
            position: "bottom",
            alignment: "center",
            textStyle:{fontSize: 16, color: "grey"}
        },
        colors:["#2E5077","#4DA1A9"],
        is3D: true,
        chartArea: { width: "75%", height: "75%" },
        pieStartAngle: 10
    };

    return (
        <div className='Mem_container'>
            <div className='mem_text'> <h2>Memory Usage</h2></div>
            <div className="mem_piechart" >
            <Chart chartType='PieChart' data={data} options={options} width={"100%"} height={"200px"}/>
            </div>
        </div>
    );
}

export default MemoryInfo;