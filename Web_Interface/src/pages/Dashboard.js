import Sidebar from "../components/Sidebar";
import MemoryInfo from "../components/Memory_info";
import DiskInfo from "../components/Disk_info";
import NetworkTrafficCharts from "./Network_Traffic";
import CPUInfo from "../components/CPU_info";
import ActiveConnections from "./Active_connections";
import React,{useState} from "react";

import './dashboard.css'

export default function Dashboard() {
    return (
        <>
            <Sidebar />
            <div className="dashboard_container">
                {/* <h2>Dashboard</h2> */}
                <div className="dashboard_inner_container">
                    <NetworkTrafficCharts/>
                    <CPUInfo/>
                    <DiskInfo/>
                    <div className="dashboard_combined_container">
                    <MemoryInfo/>
                    <ActiveConnections/>
                    </div>
                </div>
            </div>
        </>
    )
}