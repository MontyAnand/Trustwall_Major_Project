import React from 'react';
import {Link} from 'react-router-dom';
// import "./interfaceForm.css";

const Navbar=()=>{
    return (
        <>
        <h1>Suricata Configuration</h1>

<nav className="navbar">
  <ul>
    <li>
      <Link to="/suricata">Interfaces</Link>
    </li>
    <li>
      <Link to="/suricata/global-settings">Global Settings</Link>
    </li>
    {/* <li>
      <Link to="/updates">Updates</Link>
    </li> */}
    <li>
      <Link to="/suricata/alerts">Alerts</Link>
    </li>
    {/* <li>
      <Link to="/blocks">Blocks</Link>
    </li> */}
    {/* <li>
      <Link to="/files">Files</Link>
    </li> */}
    {/* <li>
      <Link to="/pass-lists">Pass Lists</Link>
    </li> */}
    {/* <li>
      <Link to="/suppress">Suppress</Link>
    </li> */}
    <li>
      <Link to="/suricata/logs-view">Logs View</Link>
    </li>
    {/* <li>
      <Link to="/logs-mgmt">Logs Mgmt</Link>
    </li>
    <li>
      <Link to="/sid-mgmt">SID Mgmt</Link>
    </li> */}
  </ul>
</nav>
        </>
    );
};

export default Navbar;
