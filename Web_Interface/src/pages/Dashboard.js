import Sidebar from "../components/Sidebar";
import MemoryInfo from "../components/Memory_info";
import DiskInfo from "../components/Disk_info";
import IncomingTraffic from "../components/Incoming_net_traffic";
import OutgoingTraffic from "../components/Outgoing_net_traffic";
import './dashboard.css'

export default function Dashboard(){
    return (
        <>
            <Sidebar />
            <div className="dashboard_container">
                <h2>Dashboard</h2>
                <div className="dashboard_inner_container">
                    <MemoryInfo/>
                    <DiskInfo/>
                    <IncomingTraffic/>
                    <OutgoingTraffic/>
                </div>
            </div>
        </>
    )
}