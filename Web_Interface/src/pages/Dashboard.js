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
                    <div className="Memory">
                    <MemoryInfo/>
                    </div>
                    <div className="Disk">
                    <DiskInfo/>
                    </div>
                    <div className="Network">
                    <NetworkTrafficCharts/>
                    </div>
                    <div className="CPU">
                    <CPUInfo/>
                    </div>
                
                </div>
            </div>
        </>
    )
}