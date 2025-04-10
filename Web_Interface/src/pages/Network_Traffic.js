import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useSocket } from "../Contexts/socketContex";

import './dashboard.css'

// Function to generate chart options dynamically
const getChartOptions = (interfaceName) => ({
  title: `Traffic for ${interfaceName}`,
  curveType: "none", // Sharp transitions
  legend: { position: "bottom", textStyle: { color: "#FFFFFF" } },
  backgroundColor: "#1E1E2F",
  titleTextStyle: { color: "#EAEAEA", fontSize: 16, bold: true },
  hAxis: {
    title: "Time",
    textStyle: { color: "#B3B3CC" },
    titleTextStyle: { color: "#EAEAEA" },
    gridlines: { color: "#444" },
  },
  vAxis: {
    title: "Traffic (KB/s)",
    textStyle: { color: "#B3B3CC" },
    titleTextStyle: { color: "#EAEAEA" },
    gridlines: { color: "#444" },
  },
  chartArea: { width: "85%", height: "70%" },
  series: {
    0: { color: "#00A8E8", lineWidth: 2 }, // RX - Light Blue
    1: { color: "#FF477E", lineWidth: 2 }, // TX - Pinkish Red
  },
});

const NetworkTrafficCharts = () => {
  const [data, setData] = useState({});
  const {socket} = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("network-traffic", (newData) => {
      setData((prevData) => {
        const updatedData = { ...prevData };

        newData.forEach(({ interface: iface, TX, RX }) => {
          const newPoint = [
            new Date().toLocaleTimeString().slice(0, 8), // HH:MM:SS format
            RX,
            TX,
          ];

          if (!updatedData[iface]) {
            updatedData[iface] = [["Time", "RX", "TX"]];
          }

          updatedData[iface] = [...updatedData[iface], newPoint];

          // Keep max 200 points
          if (updatedData[iface].length > 201) {
            updatedData[iface] = [updatedData[iface][0], ...updatedData[iface].slice(-200)];
          }
        });

        return updatedData;
      });
    });

    return () => socket.off("network-traffic");
  }, [socket]);


  // backgroundColor: "#12121C"
  
  return (
    <div id="Network_Traffic_Container" style={{ padding: "20px", minHeight: "100%",width:"100%"}}>
      <h1 style={{ color: "#EAEAEA", textAlign: "center", margin:"20px 0"}}>Real-Time Network Traffic</h1>
      {Object.keys(data).map((iface) => (
        <div
          key={iface}
          style={{
            marginBottom: "30px",
            padding: "15px",
            borderRadius: "12px",
            backgroundColor: "#1E1E2F",
          }}
        >
          <Chart chartType="LineChart" width="100%" height="300px" data={data[iface]} options={getChartOptions(iface)} />
        </div>
      ))}
    </div>
  );
};

export default NetworkTrafficCharts;
