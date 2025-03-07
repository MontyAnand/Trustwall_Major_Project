import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSocket } from "../Contexts/socketContex";
import "../pages/cpu_info.css"

const CPUInfo = () => {
    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const { socket } = useSocket();

    // useEffect(() => {
    //     if (!socket) return;

    //     socket.on("cpu-data", (incomingData) => {
    //         setData(incomingData);
    //         console.log(incomingData);
    //         setLoading(false);
    //     });

    //     return () => {
    //         socket.off("cpu-data");
    //     };
    // }, [socket]);

    // if (loading) return <p>Loading...</p>;
    const cpu_data_list = [
        [
            ["cpu_name","cpu_value"],
            ["CPU","core 1"],
            ["idle",0],
            ["iowait",1.78],
            ["other",98.02],
            ["sys",0.2],
            ["usr",3.92]
        ],
        [
            ["cpu_name","cpu_value"],
            ["CPU","core 2"],
            ["idle",9.2],
            ["iowait",8.24],
            ["other",52.77],
            ["sys",9.81],
            ["usr",3.0]
        ],
        [
            ["cpu_name","cpu_value"],
            ["CPU","core 3"],
            ["idle",7.21],
            ["iowait",0.42],
            ["other",61.80],
            ["sys",0.63],
            ["usr",12.45]
        ]
    ];

    const cleanedData = cpu_data_list.map(cpuData => cpuData.filter((_, index) => index !== 1));
    const cpuNames = cpu_data_list.map(cpuData => cpuData[1][1]); 

    const options={
        is3D :true,
        pieHole:0.5,
        pieSliceText:"percentage",
        colors: ["#E07A5F", "#85A389", "#96B6C5", "#FFC95F", "#916DB3"],
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: {
                color: "#233238",
                fontSize: 14,
            }
        }
    };

    return (
        <div className="cpu_container">
            <h1>CPU Data</h1>
            {cleanedData.length > 0 ? (
                <div className="cpu_internal_container">
                    {cleanedData.map((cdata, index) => (
                        <div className="cpu_box" key={index}>
                            <h3 className="cpu_name">{cpuNames[index]}</h3>
                            <div className="cpu_chart">
                                <Chart
                                chartType="PieChart"
                                data={cdata}
                                options={options}
                                width={"100%"}
                                height={"400px"}/>
                            </div>
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
