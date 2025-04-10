import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../pages/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  // Helper to determine if a dropdown should be active
  const isDropdownActive = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <div className="trustwall-navbar">
      <div className="logo">Trust<span>WALL</span></div>
      <ul className="nav-menu">
        <li><NavLink to="/system" className={({ isActive }) => isActive ? "active" : ""}>System</NavLink></li>

        <li className={`dropdown ${isDropdownActive(["/interface"]) ? "active-dropdown" : ""}`}>
          <span>Interfaces ▼</span>
          <ul className="dropdown-menu">
            <li><NavLink to="/interface">Interface Assignments</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/firewall" className={({ isActive }) => isActive ? "active" : ""}>Firewall</NavLink></li>

        <li className={`dropdown ${isDropdownActive(["/DHCP-Configuration", "/suricata"]) ? "active-dropdown" : ""}`}>
          <span>Services ▼</span>
          <ul className="dropdown-menu">
            <li><NavLink to="/DHCP-Configuration">DHCP Server</NavLink></li>
            <li><NavLink to="/suricata">Suricata</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/VPN" className={({ isActive }) => isActive ? "active" : ""}>VPN</NavLink></li>

        <li className={`dropdown ${isDropdownActive(["/services", "/dashboard"]) ? "active-dropdown" : ""}`}>
          <span>Status ▼</span>
          <ul className="dropdown-menu">
            <li><NavLink to="/services">Services Status</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          </ul>
        </li>

        <li className={`dropdown ${isDropdownActive(["/antivirus", "/terminal"]) ? "active-dropdown" : ""}`}>
          <span>Diagonistics ▼</span>
          <ul className="dropdown-menu">
            <li><NavLink to="/antivirus">Virus Scanning</NavLink></li>
            <li><NavLink to="/terminal">Terminal</NavLink></li>
          </ul>
        </li>

        <li><NavLink to="/help" className={({ isActive }) => isActive ? "active" : ""}>Help</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
