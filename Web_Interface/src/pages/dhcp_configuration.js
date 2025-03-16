import React, { useState } from "react";
import "./dhcp_configuration.css";

function DHCPConfiguration() {
  const [content1, setContent1] = useState([false, null]);
  const [content2, setContent2] = useState([false, null]);
  const [content3, setContent3] = useState([false, null]);
  const [content4, setContent4] = useState([false, null]);
  const [content5, setContent5] = useState([false, null]);

  return (
    <div className="dhcp_container">
      <h1>DHCPv4 Configuration Server</h1>
      {/* General setting */}
      <h2
        onClick={() =>
          setContent1((prevContent) => [
            !prevContent[0],
            <div className="dhcp_internal_container">
              <form className="dhcp_general_container">
                <div className="dhcp_text">
                  <label>DHCP Backend:</label>
                  <input type="text" placeholder="ISC DHCP"></input>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label>Enable</label>
                    <input type="checkbox"></input>
                  </div>
                  <p>Enable DHCP server on LAN interface</p>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">BOOTP</label>
                    <input type="checkbox"></input>
                  </div>
                  <p>Ignore BOOTP queries</p>
                </div>
                <div className="dhcp_select">
                  <label>Deny Unknown Clients:</label>
                  <select name="Interfaces">
                    <option>Allow All Clients</option>
                    <option value="option1">option1</option>
                    <option value="option2">option2</option>
                    <option value="option2">option3</option>
                  </select>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">Ignore Denied Clients</label>
                    <input type="checkbox"></input>
                  </div>
                  <p>Ignore denied clients rather than reject</p>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">Ignored Client Identifiers</label>
                    <input type="checkbox"></input>
                  </div>
                  <p>
                    Do not record a unique identifier(UID) in client <br></br>
                    lease data if present in client DHCP request
                  </p>
                </div>
              </form>
            </div>,
          ])
        }
      >
        General DHCP Options
      </h2>
      {content1[0] ? <>{content1[1]}</> : <></>}
      {/* Primary address pool */}
      <h2
        onClick={() =>
          setContent2((prevContent) => [
            !prevContent[0],
            <div className="dhcp_internal_container">
              <div className="dhcp_primary_container">
                <div className="dhcp_text">
                  <label>Subnet: </label>
                  <input type="text" placeholder="192.168.1.0/24"></input>
                </div>
                <div className="dhcp_text">
                  <label>Subnet Range: </label>
                  <input
                    type="text"
                    placeholder="192.168.1.1 - 192.168.1.254"
                  ></input>
                </div>
                <div className="dhcp_text">
                  <label className="dhcp_special_text">
                    Address pool range{" "}
                  </label>
                  <label>From</label>
                  <input type="text" placeholder="192.168.1.100"></input>
                  <label>To</label>
                  <input type="text" placeholder="192.168.1.200"></input>
                </div>
                <div className="dhcp_add_btn">
                  {/* <label>Additional Pools</label> */}
                  <button
                    onClick={() => {
                      // Write a custom function to add more address pool if someone click this button
                    }}
                  >
                    <span>&#43;</span> Add Address Pool
                  </button>
                </div>
              </div>
            </div>,
          ])
        }
      >
        Primary Address Pool
      </h2>
      {content2[0] ? <>{content2[1]}</> : <></>}
      {/* Server setting */}
      <h2
        onClick={() =>
          setContent3((prevContent) => [
            !prevContent[0],
            <div className="dhcp_internal_container">
              <div className="dhcp_server_container">
                <div className="dhcp_text">
                  <label>WINS Servers</label>
                  <input type="text" placeholder="WINS Server 1"></input>
                  <input type="text" placeholder="WINS Server 2"></input>
                </div>
                <div className="dhcp_text">
                  <label>DNS Servers</label>
                  <input type="text" placeholder="192.168.1.1"></input>
                  <input type="text" placeholder="DNS Server 1"></input>
                  <input type="text" placeholder="DNS Server 2"></input>
                  <input type="text" placeholder="DNS Server 3"></input>
                </div>
              </div>
            </div>,
          ])
        }
      >
        Server Settings
      </h2>
      {content3[0] ? <>{content3[1]}</> : <></>}

      {/* OMAPI */}
      <h2
        onClick={() =>
          setContent4((prevContent) => [
            !prevContent[0],
            <div className="dhcp_internal_container">
              <div className="dhcp_omapi_container">
                <div className="dhcp_text">
                  <label>OMAPI Port</label>
                  <input type="text" placeholder="OMAPI Port"></input>
                </div>
                <div className="dhcp_text">
                  <label>OMAPI Key</label>
                  <input type="text" placeholder="OMAPI Key"></input>
                </div>
                <div className="dhcp_select">
                  <label>Key Algorithm</label>
                  <select name="Algorithm_names">
                    <option>Select Algorithm</option>
                    <option value="algo1">Algorithm 1</option>
                    <option value="algo2">Algorithm 2</option>
                    <option value="algo3">Algorithm 3</option>
                  </select>
                </div>
                <div className="dhcp_checkbox">
                  <label>Generate New Key</label>
                  <input type="checkbox"></input>
                </div>
                <p>Generate a new key based one selected algorithm</p>
              </div>
            </div>,
          ])
        }
      >
        OMAPI
      </h2>
      {content4[0] ? <>{content4[1]}</> : <></>}

      {/* Other DHCP options */}
      <h2
        onClick={() =>
          setContent5((prevContent) => [
            !prevContent[0],
            <div className="dhcp_internal_container">
              <div className="dhcp_other_container">
                <div className="dhcp_text">
                  <label>Gateway:</label>
                  <input type="text" placeholder="192.168.1.1"></input>
                </div>
                <div className="dhcp_text">
                  <label>Domain Name:</label>
                  <input type="text" placeholder="home arpa"></input>
                </div>
                <div className="dhcp_text">
                  <label>Domain Search List:</label>
                  <input type="text" placeholder="example.com"></input>
                </div>
                <div className="dhcp_number">
                  <label>Default Lease Time:</label>
                  <input type="number" placeholder="7200"></input>
                </div>
                <div className="dhcp_number">
                  <label>Maximum Lease Time:</label>
                  <input type="number" placeholder="86400"></input>
                </div>
                <div className="dhcp_text">
                  <label>Failover peer IP:</label>
                  <input type="text"></input>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">Static ARP:</label>
                    <input type="checkbox" for=""></input>
                  </div>
                  <p>Enable Static ARP enteries</p>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">Time Format Change:</label>
                    <input type="checkbox" for=""></input>
                  </div>
                  <p>Change DHCP display lease time from UTC to local time</p>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">Statistics graphs:</label>
                    <input type="checkbox" for=""></input>
                  </div>
                  <p>Enable monitoring graphs for DHCP lease statistics</p>
                </div>
                <div className="dhcp_checkbox">
                  <div>
                    <label name="">Ping check:</label>
                    <input type="checkbox" for=""></input>
                  </div>
                  <p>Disable ping check</p>
                </div>
                <div className="dhcp_btn">
                  <label>Dynamic DNS:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
                <div className="dhcp_btn">
                  <label>MAC Address Control:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
                <div className="dhcp_btn">
                  <label>NTP:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
                <div className="dhcp_btn">
                  <label>TFTP:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
                <div className="dhcp_btn">
                  <label>LDAP:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
                <div className="dhcp_btn">
                  <label>Network Booting:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
                <div className="dhcp_btn">
                  <label>Custom DHCP Options:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>
              </div>
            </div>,
          ])
        }
      >
        Other DHCP Settings
      </h2>
      {content5[0] ? <>{content5[1]}</> : <></>}
      <div className="dhcp_btn_container">
        <button type="submit" className="dhcp_save_btn">
          Save Configuration
        </button>
      </div>
    </div>
  );
}

export default DHCPConfiguration;
