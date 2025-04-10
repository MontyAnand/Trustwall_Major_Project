import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useSocket } from "../Contexts/socketContex";
import "../pages/cpu_info.css"

const CPUInfo = () => {
    const [cleanedData, setCleanedData] = useState([]);
    const [cpuNames, setCpuNames] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit("getCPUInfo");
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on("cpu-data", (data) => {
            setCpuNames(data.map(obj => "Core : " + obj.CPU));
            const X = data.map(({ CPU, ...rest }) => rest);
            const listFormat = X.map(obj => Object.entries(obj));
            const cpu_data_list = listFormat.map(arr => [["cpu_name", "cpu_value"], ...arr]);
            console.log(cpu_data_list);
            setCleanedData(cpu_data_list);
            console.log(cleanedData);
        });

        return () => {
            socket.off("cpu-data");
        };
    }, [socket]);

    const options = {
        is3D: true,
        pieHole: 0.5,
        pieSliceText: "percentage",
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
                <div id="cpu_internal_container" className="cpu_internal_container">
                    {cleanedData.map((cdata, index) => (
                        <div className="cpu_box" key={index}>
                            <h3 className="cpu_name">{cpuNames[index]}</h3>
                            <div className="cpu_chart">
                                <Chart
                                chartType="PieChart"
                                data={cdata}
                                options={options}
                                width={"100%"}
                                height={"100%"}/>
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
