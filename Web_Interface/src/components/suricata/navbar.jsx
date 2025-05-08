import React from "react";
import { Link ,useLocation} from "react-router-dom";
// import "./interfaceForm.css";

const Navbar = () => {
  const location=useLocation();
  return (

    <>
      <div className="outside_suricata_container">
        <h1 style={{textAlign:'center'}}>Suricata Configuration</h1>

        <nav className="suricata-navbar">
          <ul>
            <li>
              <Link to="/suricata" style={{textDecoration:location.pathname==='/suricata'?"underline":'none'}}>Interfaces</Link>
            </li>
            <li>
              <Link to="/suricata/global-settings" style={{textDecoration:location.pathname==='/suricata/global-settings'?"underline":'none'}}>Global Settings</Link>
            </li>
            {/* <li>
      <Link to="/updates">Updates</Link>
    </li> */}
            <li>
              <Link to="/suricata/alerts" style={{textDecoration:location.pathname==='/suricata/alerts'?"underline":'none'}}>Alerts</Link>
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
              <Link to="/suricata/logs-view" style={{textDecoration:location.pathname==='/suricata/logs-view'?"underline":'none'}}>Logs View</Link>
            </li>
            {/* <li>
      <Link to="/logs-mgmt">Logs Mgmt</Link>
    </li>
    <li>
      <Link to="/sid-mgmt">SID Mgmt</Link>
    </li> */}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
