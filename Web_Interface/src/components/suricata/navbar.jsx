import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {

  return (
    <>
      <h1 >Suricata Configuration</h1>

      <nav className="navbar">
        <ul>

          <li>
            <NavLink to="/suricata">Interfaces</NavLink>
          </li>

          <li>
            <NavLink to="/suricata/global-settings" className={({ isActive }) => isActive ? "active" : ""}>Global Settings</NavLink>
          </li>

          <li>
            <NavLink to="/suricata/alerts" className={({ isActive }) => isActive ? "active" : ""}>Alerts</NavLink>
          </li>

          <li>
            <NavLink to="/suricata/blocks" className={({ isActive }) => isActive ? "active" : ""}>Blocks</NavLink>
          </li>

          <li>
            <NavLink to="/suricata/logs-view" className={({ isActive }) => isActive ? "active" : ""}>Logs View</NavLink>
          </li>

          <li>
            <NavLink to="/suricata/logs-mgmt" className={({ isActive }) => isActive ? "active" : ""}>Logs Mgmt</NavLink>
          </li>

          <li>
            <NavLink to="/suricata/sid-mgmt" className={({ isActive }) => isActive ? "active" : ""}>SID Mgmt</NavLink>
          </li>

        </ul>
      </nav>
    </>
  );
};

export default Navbar;
