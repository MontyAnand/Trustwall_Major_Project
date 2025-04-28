import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Antivirus from "./pages/Antivirus";
import Firewall from "./pages/Firewall";
import VPN from "./VPN/VPNPage";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceTable from "./pages/ServiceList";
import CPUInfo from "./components/CPU_info";
import NetworkTrafficChart from "./pages/Network_Traffic"
import LinuxTerminal from "./pages/Terminal"
// import Suricata from "./pages/Suricata";
import Suricata from "./components/suricata/homePage";
import InterfaceForm from "./components/suricata/interfaceForm";
import GlobalSettingsForm from "./components/suricata/global_settingsForm";
import AlertsViewForm from "./components/suricata/alertsView";
// import BlocksViewForm from "./components/suricatablockView";
import LogViewForm from "./components/suricata/logView";
// import LogManagement from "./components/suricatalogManagement";
// import SidManagement from "./components/suricatasidManagement";
import DHCPConfiguration from "./pages/dhcp_configuration";
import StaticMappingsForm from "./components/dhcp/staticMappingsForm";
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
            <Route path="/VPN" element={<VPN />} />
            <Route path="/antivirus" element={<Antivirus />} />
              
               {/* Suricata routes for front-end  */}
              <Route path="/suricata" element={<Suricata />} />
              <Route path="/suricata/add" element={<InterfaceForm />} />
              <Route path="/suricata/edit/:id" element={<InterfaceForm />} />
              <Route path="/suricata/global-settings" element={<GlobalSettingsForm />} />
              <Route path="/suricata/alerts" element={<AlertsViewForm />} />
              <Route path="/suricata/logs-view" element={<LogViewForm />} />


              <Route path="/services" element={<ServiceTable />} />
              <Route path="/cpu-info" element={<CPUInfo />} />
              <Route path="/network-traffic" element={<NetworkTrafficChart />} />
              <Route path="/terminal" element={<LinuxTerminal />} />

              {/* DHCP routes for frontend */}
              <Route path="/dhcp" element={<DHCPConfiguration />} />
              <Route path="/dhcp/static-mappings/add" element={<StaticMappingsForm/>} />
              <Route path="/dhcp/static-mappings/edit/:id" element={<StaticMappingsForm/>} />

              <Route path="/firewall" element={<Firewall />} />
              <Route path="/interface" element={<Interface />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/active-connection" element={<ActiveConnections />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
