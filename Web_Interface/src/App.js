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
// import Suricata from "./pages/Suricata"
import DHCPConfiguration from "./pages/dhcp_configuration";
import Interface from "./pages/Interface";
import HomePage from "./components/suricata/homePage";
import InterfaceForm from "./components/suricata/interfaceForm";
import GlobalSettingsForm from "./components/suricata/global_settingsForm";
import AlertsViewForm from "./components/suricata/alertsView";
import BlocksViewForm from "./components/suricata/blockView";
import LogViewForm from "./components/suricata/logView";
import LogManagement from "./components/suricata/logManagement";
import SidManagement from "./components/suricata/sidManagement";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="flex-1" style={{ padding: '0' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/suricata" element={<HomePage/>}>
              <Route path="add" element={<InterfaceForm />} />
              <Route path="edit/:id" element={<InterfaceForm />} />
              <Route path="global-settings" element={<GlobalSettingsForm />} />
              <Route path="alerts" element={<AlertsViewForm />} />
              <Route path="blocks" element={<BlocksViewForm />} />
              <Route path="logs-view" element={<LogViewForm />} />
              <Route path="logs-mgmt" element={<LogManagement />} />
              <Route path="sid-mgmt" element={<SidManagement />} />
            </Route>
            <Route path="/services" element={<ServiceTable />} />
            <Route path="/cpu-info" element={<CPUInfo />} />
            <Route path="/network-traffic" element={<NetworkTrafficChart />} />
            <Route path="/terminal" element={<LinuxTerminal />} />
            <Route path="/DHCP-Configuration" element={<DHCPConfiguration />} />
            <Route path="/firewall" element={<Firewall />} />
            <Route path="/interface" element={<Interface />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/antivirus" element={<Antivirus />} />
              <Route path="/VPN" element={<VPN />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
