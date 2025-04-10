import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Antivirus from "./pages/Antivirus";
import Firewall from "./pages/Firewall";
import VPN from "./pages/VPN";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceTable from "./pages/ServiceList";
import CPUInfo from "./components/CPU_info";
import NetworkTrafficChart from "./pages/Network_Traffic"
import LinuxTerminal from "./pages/Terminal"
import Suricata from "./pages/Suricata"
import DHCPConfiguration from "./pages/dhcp_configuration";
import Interface from "./pages/Interface";
import ActiveConnections from "./pages/Active_connections";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="flex-1" style={{ padding: '0' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/antivirus" element={<Antivirus />} />
              <Route path="/VPN" element={<VPN />} />
              <Route path="/suricata" element={<Suricata />} />
              {<Route path="/services" element={<ServiceTable />} />}
              <Route path="/cpu-info" element={<CPUInfo />} />
              <Route path="/network-traffic" element={<NetworkTrafficChart />} />
              <Route path="/terminal" element={<LinuxTerminal />} />
              <Route path="/DHCP-Configuration" element={<DHCPConfiguration />} />
              <Route path="/firewall" element={<Firewall />} />
              <Route path="/interface" element={<Interface />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/active-connection" element={<ActiveConnections />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
