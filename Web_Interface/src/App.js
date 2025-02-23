import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Antivirus from "./pages/Antivirus";
import Firewall from "./pages/Firewall";
import VPN from "./pages/VPN";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceTable from "./pages/ServiceList";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/services" element={<ServiceTable/>}/>
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/antivirus" element={<Antivirus />} />
              <Route path="/firewall" element={<Firewall />} />
              <Route path="/VPN" element={<VPN />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
