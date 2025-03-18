import React, { useState } from "react";
import "./dhcp_configuration.css";
import axios from "axios";

function DHCPConfiguration() {
  const [content1, setContent1] = useState([false, null]);
  const [content2, setContent2] = useState([false, null]);
  const [content3, setContent3] = useState([false, null]);
  const [content4, setContent4] = useState([false, null]);
  const [content5, setContent5] = useState([false, null]);

  const [lanInterface, changeLANInterface] = useState(true);
  const [bootp, changeBootp] = useState(false);
  const [clientAccept, changeClientAccept] = useState("0");
  const [denyClient, changeDenyClient] = useState(false);
  const [ignoreClientID, changeIgnoreClientID] = useState(false);
  const [subnet, changeSubnet] = useState("192.168.1.0");
  const [mask, changeMask] = useState("24");
  const [startIP, changeStartIP] = useState("192.168.10.100");
  const [endIP, changeEndIP] = useState("192.168.10.200");

  const handleLanInterface = (event) => {
    changeLANInterface(event.target.checked);
    console.log("Checkbox is now:", event.target.checked);
  };

  const handleBootp = (event) => {
    changeBootp(event.target.checked);
  }

  const handleClientAccept = (event) => {
    changeClientAccept(event.target.value);
  }

  const handleDenyClient = (event) => {
    changeDenyClient(event.target.checked);
  }

  const handleIgnoreClientID = (event) => {
    changeIgnoreClientID(event.target.checked);
  }

  const handleStartIP = (event) => {
    changeStartIP(event.target.value);
  }

  const handleEndIP = (event) => {
    changeEndIP(event.target.value);
  }

  const handleSubnet = (event) => {
    changeSubnet(event.traget.value);
  }

  const handleMask = (event) => {
    changeMask(event.target.value);
  }

  const submitConfiguration = async () => {
    const data = new FormData();
    data.append("lan", lanInterface);
    data.append("bootp", bootp);
    data.append("clientAccept", clientAccept);
    data.append("denyClient", denyClient);
    data.append("ignoreClientID", ignoreClientID);
    data.append("subnet", subnet);
    data.append("mask", mask);
    data.append("startIP", startIP);
    data.append("endIP", endIP);

    // Print FormData values before sending
    console.log("FormData Contents:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/save`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error in submitting the configuration:", error);
      alert("Error in submitting the configuration.");
    }
  };

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
                  <input type="text" placeholder="DHCP vendor" value="ISC DHCP" readOnly></input>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="interface">Enable</label>
                    <input type="checkbox" name="interface" onChange={handleLanInterface} ></input>
                  </div>
                  <p>Enable DHCP server on LAN interface</p>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="bootp">BOOTP</label>
                    <input type="checkbox" name="bootp" onChange={handleBootp}></input>
                  </div>
                  <p>Ignore BOOTP queries</p>
                </div>

                <div className="dhcp_select">
                  <label>Deny Unknown Clients:</label>
                  <select name="client_accept" onChange={handleClientAccept}>
                    <option value="0">Allow all clients</option>
                    <option value="1">Allow all clients from any interface</option>
                    <option value="2">Allow clients from only this interface</option>
                  </select>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="deny_client">Ignore Denied Clients</label>
                    <input type="checkbox" name="deny_client" onChange={handleDenyClient}></input>
                  </div>
                  <p>Ignore denied clients rather than reject</p>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="ign_client_id">Ignored Client Identifiers</label>
                    <input type="checkbox" name="ign_client_id" onChange={handleIgnoreClientID}></input>
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
                  <label for="subnet">Subnet: </label>
                  <input type="text" name="subnet" value="192.168.1.0" onChange={handleSubnet} readOnly></input>
                </div>

                <div className="dhcp_text">
                  <label for="mask" >Subnet Mask: </label>
                  <input
                    type="number"
                    placeholder=""
                    name="mask"
                    value="24"
                    max="32"
                    min="1"
                    onChange={handleMask}
                    readOnly
                  ></input>
                </div>

                <div className="dhcp_text">
                  <label for="subnet_range">Subnet Range: </label>
                  <input
                    type="text"
                    name="subnet_range"
                    value="192.168.1.1 - 192.168.1.254"
                    readOnly
                  ></input>
                </div>

                <div className="dhcp_text">
                  <label className="dhcp_special_text">Address pool range:</label>
                  <br></br><br></br>
                  <label for="startIP">From</label>
                  <br></br>
                  <input type="text" name="startIP" onChange={handleStartIP}></input>
                  <br></br><br></br>
                  <label for="endIP">To</label>
                  <br></br>
                  <input type="text" name="endIP" onChange={handleEndIP}></input>
                </div>

                <div className="dhcp_add_btn">
                  <label>Additional Pools</label>
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
                  <input type="text" name="wins1" placeholder="WINS Server 1"></input>
                  <input type="text" name="wins2" placeholder="WINS Server 2"></input>
                </div>

                <div className="dhcp_text">
                  <label>DNS Servers</label>
                  <input type="text" name="gateway" value="192.168.1.1" readOnly></input>
                  <input type="text" name="dns1" placeholder="DNS Server 1"></input>
                  <input type="text" name="dns2" placeholder="DNS Server 2"></input>
                  <input type="text" name="dns3" placeholder="DNS Server 3"></input>
                </div>
              </div>
            </div>,
          ])
        }
      >
        Server Options
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
                  <div className="dhcp_checkbox">
                    <label for="algo_key">Generate New Key</label>
                    <input type="checkbox" name="algo_key"></input>
                  </div>
                  <p>Generate a new key based one selected algorithm</p>
                </div>

                <div className="dhcp_select">
                  <label for="Algorithm_names">Key Algorithm</label>
                  <select name="Algorithm_names">
                    <option value="algo1">Algorithm 1</option>
                    <option value="algo2">Algorithm 2</option>
                    <option value="algo3">Algorithm 3</option>
                  </select>
                </div>
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
                  <label for="gateway">Gateway:</label>
                  <input type="text" name="gateway" value="192.168.1.1" readOnly></input>
                </div>

                <div className="dhcp_text">
                  <label for="domainName">Domain Name:</label>
                  <input type="text" name="domainName" placeholder="home arpa"></input>
                </div>

                <div className="dhcp_text">
                  <label for="domain_search">Domain Search List:</label>
                  <input type="text" name="domain_search" placeholder="example.com"></input>
                </div>

                <div className="dhcp_number">
                  <label for="lease_time">Default Lease Time:</label>
                  <input type="number" name="lease_time" value="7200"></input>
                </div>

                <div className="dhcp_number">
                  <label for="max_lease_time">Maximum Lease Time:</label>
                  <input type="number" name="max_lease_time" value="86400"></input>
                </div>

                <div className="dhcp_text">
                  <label for="failover_ip">Failover peer IP:</label>
                  <input type="text" name="failover_ip" placeholder="192.168.x.x"></input>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="enable_static_arp">Static ARP:</label>
                    <input type="checkbox" name="enable_static_arp"></input>
                  </div>
                  <p>Enable Static ARP enteries</p>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="time_format">Time Format Change:</label>
                    <input type="checkbox" name="time_format"></input>
                  </div>
                  <p>Change DHCP display lease time from UTC to local time</p>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="enable_stats">Statistics graphs:</label>
                    <input type="checkbox" name="enable_stats"></input>
                  </div>
                  <p>Enable monitoring graphs for DHCP lease statistics</p>
                </div>

                <div className="dhcp_checkbox">
                  <div>
                    <label for="ping_check">Ping check:</label>
                    <input type="checkbox" name="ping_check"></input>
                  </div>
                  <p>Disable ping check</p>
                </div>

                <div className="dhcp_btn">
                  <label for="ddns">Dynamic DNS:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

                <div className="dhcp_btn">
                  <label for="mac_addr_cntl" >MAC Address Control:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

                <div className="dhcp_btn">
                  <label for="ntp">NTP:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

                <div className="dhcp_btn">
                  <label for="tftp">TFTP:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

                <div className="dhcp_btn">
                  <label for="ldap">LDAP:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

                <div className="dhcp_btn">
                  <label for="net_boot">Network Booting:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

                <div className="dhcp_btn">
                  <label for="cus_dhcp">Custom DHCP Options:</label>
                  <button>
                    <span>&#9965;</span> Display Advanced
                  </button>
                </div>

              </div>
            </div>,
          ])
        }
      >
        Other DHCP Options
      </h2>
      {content5[0] ? <>{content5[1]}</> : <></>}
      <div className="dhcp_btn_container">
        <button type="submit" onClick={submitConfiguration} className="dhcp_save_btn">
          Save Configuration
        </button>
      </div>
    </div>
  );
}

export default DHCPConfiguration;
