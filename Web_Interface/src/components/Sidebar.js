import { Link , useLocation} from "react-router-dom";
import "../pages/Sidebar.css";
import { useAuth } from "../Contexts/authContex";


function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="sidebar-container">
      <h2 className="sidebar-heading">TRUSTWALL</h2>
      <nav className="sidebar-navbar">
        <ul className="sidebar-box">
        <li className="py-2"><Link to="/dashboard" style={{color:location.pathname === "/dashboard" ? "#007bff" :"white"}} >Dashboard</Link></li>
        <li className="py-2"><Link to="/VPN" style={{color: location.pathname === "/VPN"? "#007bff" :"white"}} >VPN</Link></li>
        <li className="py-2"><Link to="/firewall" style={{color:location.pathname === "/firewall" ? "#007bff" :"white"}}>Firewall</Link></li>
        <li className="py-2"><Link to="/interface" style={{color:location.pathname === "/interface"? "#007bff" :"white"}} >Interfaces</Link></li>
        <li className="dropdown_comp">
            <p style={{color:location.pathname === "/" ? "#007bff" :"white"}} >Systems<span style={{color:"white"}}>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/" onClick={()=>{logout();}} style={{fontSize: '15px',color:location.pathname === "/" ? "#007bff" :"white"}} >Signout</Link>
            </div>
          </li>
          <li className="dropdown_comp">
            <p style={{color:location.pathname === "/suricata"|location.pathname === "/DHCP-Configuration"|location.pathname === "/services" ? "#007bff" :"white"}}>Services<span style={{color:"white"}}>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/suricata" style={{fontSize: '15px',color:location.pathname === "/suricata" ? "#007bff" :"white"}} >Suricata</Link>
            <Link to="/DHCP-Configuration" style={{fontSize: '15px',color:location.pathname === "/DHCP-Configuration" ? "#007bff" :"white"}}  >DHCP Server</Link>
            <Link to="/services" style={{fontSize: '15px',color:location.pathname === "/services" ? "#007bff" :"white"}}  >Services Table</Link>
            </div>
          </li>
          <li className="dropdown_comp" >
            <p style={{fontSize: '15px',color:location.pathname === "/active-connection" ? "#007bff" :"white"}}>Status<span style={{color:"white"}}>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/active-connection" style={{fontSize: '15px',color:location.pathname === "/active-connection" ? "#007bff" :"white"}}>Active Connetions</Link>
            </div>
          </li>
          <li className="dropdown_comp">
            <p style={{fontSize: '15px',color:location.pathname === "/antivirus" ? "#007bff" :"white"}}>Diagnostics<span style={{color:"white"}}>&#11206;</span></p>
            <div className="dropdown_menu">
            <Link to="/antivirus" style={{fontSize: '15px',color:location.pathname === "/antivirus" ? "#007bff" :"white"}}>Antivirus</Link>
            </div>
          </li>
          <li className="py-2"><Link style={{color:location.pathname === "/terminal" ? "#007bff" :"white"}} to="/terminal">Terminal</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;