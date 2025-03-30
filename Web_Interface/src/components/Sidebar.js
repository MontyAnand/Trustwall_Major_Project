import { Link } from "react-router-dom";
import "../pages/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-heading">TRUSTWALL</h2>
      <nav className="sidebar-navbar">
        <ul className="sidebar-box">
        {/* <li className="py-2"><Link to="/">Dashboard</Link></li> */}
        <li className="py-2"><Link to="/VPN">VPN</Link></li>
        <li className="py-2"><Link to="/firewall">Firewall</Link></li>
        <li className="py-2"><Link to="/interface">Interfaces</Link></li>
        <li className="dropdown_comp">
            <p>Systems<span>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/" style={{fontSize: '15px'}}>Signout</Link>
            </div>
          </li>
          <li className="dropdown_comp">
            <p>Services<span>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/suricata" style={{fontSize: '15px'}}>Suricata</Link>
            <Link to="/DHCP-Configuration" style={{fontSize: '15px'}}>DHCP Server</Link>
            </div>
          </li>
          <li className="dropdown_comp" >
            <p>Status<span>&#11206;</span></p>
            <div className="dropdown_menu" >
            <Link to="/services" style={{fontSize: '15px'}} >Services Table</Link>
            <Link to="/dashboard" style={{fontSize: '15px'}}>Dashboard</Link>
            </div>
          </li>
          <li className="dropdown_comp">
            <p>Diagnostics<span>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/antivirus" style={{fontSize: '15px'}}>Antivirus</Link>
            </div>
          </li>
          
          {/* <li className="py-2"><Link to="/services">Services Table</Link></li> */}
          <li className="py-2"><Link to="/terminal">Terminal</Link></li>
          {/* <li className="py-2"><Link to="/DHCP-Configuration">DHCP Server</Link></li>
          <li className="py-2"><Link to="/antivirus">Antivirus</Link></li>
          <li className="py-2"><Link to="/suricata">Suricata</Link></li> */}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;