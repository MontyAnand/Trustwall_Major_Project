import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Antivirus from "./pages/Antivirus";
import Firewall from "./pages/Firewall";
import Sidebar from "./components/Sidebar";
import { SocketProvider } from "./Contexts/socketContex";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="flex">
          {/* <Sidebar /> */}
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/antivirus" element={<Antivirus />} />
              <Route path="/firewall" element={<Firewall />} />
            </Routes>
          </div>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
