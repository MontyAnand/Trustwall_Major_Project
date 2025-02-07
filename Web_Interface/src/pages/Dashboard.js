import Sidebar from "../components/Sidebar";
import './dashboard.css'

export default function Dashboard(){
    return (
        <>
            <Sidebar />
            <div className="dashboard_container">
                <h2>Dashboard</h2>
            </div>
        </>
    )
}