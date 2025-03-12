import { Link } from "react-router-dom";
import "../pages/Sidebar.css";

function Sidebar() {
  return (
    <div className="container">
      <h2 className="heading">TRUSTWALL</h2>
      <nav className="navbar">
        <ul className="box">
          <li className="py-2"><Link to="/">Dashboard</Link></li>
          <li className="py-2"><Link to="/antivirus">Antivirus</Link></li>
          <li className="py-2"><Link to="/firewall">Firewall</Link></li>
          <li className="py-2"><Link to="/VPN">VPN</Link></li>
          <li className="py-2"><Link to="/services">Services</Link></li>
          <li className="py-2"><Link to="/cpu-info">CPU Status</Link></li>
          <li className="py-2"><Link to="/network-traffic">Network Analysis</Link></li>
          <li className="py-2"><Link to="/terminal">Terminal</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;