import React, { useState, useEffect } from "react";
import "./dhcp_configuration.css";
// import DynamicDNS from "../components/dynamicDNS";
// import MACAddressControl from "../components/MACAddressControl";
// import NTP from "../components/NTP";
// import TFTP from "../components/TFTP";
// import LDAP from "../components/LDAP";
// import NetworkBooting from "../components/NetworkBooting";
// import CustomDHCP from "../components/customDHCP";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import StaticMappings from "../components/dhcp/staticMappings";

function DHCPConfiguration() {

  const [formData, setFormData] = useState({
    enableInterface: false,
    enableBootp: false,
    clientType: "0",
    enableIgnDeniedClient: false,
    enableIgnClientIdentfier: false,

    subnet: "",
    mask: "",
    subnetRange: "",
    rangeStart: "",
    rangeEnd: "",

    wins1: "",
    wins2: "",
    dns1: "",
    dns2: "",
    dns3: "",
    dns4: "",

    omapiPort: "",
    omapiKey: "",
    omapiAlgo: "2",
    enableKey: false,

    gateway: "",
    domainName: "",
    domainSearchList: "",
    defaultLeaseTime: 720,
    maxLeaseTime: 3600,

    enableStaticArp: false,
    enableChangeTimeFormat: false,
    enableStatisticsGraph: false,
    disablePingCheck: false,
    pingTimeout: 2
  });

  // useState for controlling submit button's functionality
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [enableButtonset, setEnableButtonSet] = useState(false);
  const [disableStart, setdisableStart] = useState(true);
  const [disableRestart, setdisableRestart] = useState(true);
  const [disableStop, setdisableStop] = useState(true);


  // Function to convert an IP address to binary
  const ipToBinary = (ip) => {
    if (ip === '' || ip === undefined) {
      return '';
    }
    return ip
      .split(".")
      .map((octet) => parseInt(octet, 10).toString(2).padStart(8, "0"))
      .join(".");
  }

  // Function to convert a binary IP back to dotted decimal format
  function binaryToIp(binaryIp) {
    if (binaryIp === '') {
      return '';
    }
    return binaryIp
      .split(".")
      .map((binaryOctet) => parseInt(binaryOctet, 2))
      .join(".");
  }
  // Fetch Stored Data from server


  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/api/settings`).then((res) => {
      setFormData({ ...formData, ...res.data });        
    });
  }, []);

useEffect(()=>{
  if(disableSubmitButton===false){
    setEnableButtonSet(true);
    serviceStatusManagement();
  }
},[disableSubmitButton]);

  useEffect(() => {
    // Function to perform bitwise AND operation on two IPs
    function bitwiseAnd(ip1, ip2) {
      const binaryIp1 = ipToBinary(ip1).split(".");
      const binaryIp2 = ipToBinary(ip2).split(".");

      const andResult = binaryIp1.map((octet, index) => {
        // Perform AND operation on each octet
        return (parseInt(octet, 2) & parseInt(binaryIp2[index], 2))
          .toString(2)
          .padStart(8, "0");
      });

      return andResult.join(".");
    }

    axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/laninfo`)
      .then((res) => {
        setFormData(prevData => ({
          ...prevData,
          subnet: binaryToIp(bitwiseAnd(res.data.ip, res.data.nm)),
          mask: res.data.nm,
          gateway: res.data.gip
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch network info:", err);
      });
  }, []);

  //useEffect for controlling submit button's functionality and rendeing the updates
  useEffect(() => {
    // Function to perform bitwise AND operation on two IPs
    function bitwiseAnd(ip1, ip2) {
      if (ip1 === '' || ip2 === '') {
        return '';
      }
      const binaryIp1 = ipToBinary(ip1).split(".");
      const binaryIp2 = ipToBinary(ip2).split(".");

      const andResult = binaryIp1.map((octet, index) => {
        // Perform AND operation on each octet
        return (parseInt(octet, 2) & parseInt(binaryIp2[index], 2))
          .toString(2)
          .padStart(8, "0");
      });

      return andResult.join(".");
    }

    // Function to check if an IP is in a subnet
    function isIpInSubnet(ip, subnetIp, subnetMask) {
      if (ip === '') {
        return false;
      }
      const andResult = bitwiseAnd(ip, subnetMask); // Perform AND operation between IP and subnet mask
      const networkAddress = bitwiseAnd(subnetIp, subnetMask); // Get the network address of the subnet

      return andResult === networkAddress;
    }


    if (formData.enableInterface) {
      if (isIpInSubnet(formData.rangeStart, formData.subnet, formData.mask) && isIpInSubnet(formData.rangeEnd, formData.subnet, formData.mask)) {
        setDisableSubmitButton(false);
      } else {
        setDisableSubmitButton(true);
      }
    } else {
      setDisableSubmitButton(true);
    }
  }, [formData.enableInterface, formData.rangeStart, formData.rangeEnd, formData.subnet, formData.mask]);

  // Recalculate subnet range when subnet or mask changes
  useEffect(() => {
    // Handle possible Subnet range
    const calculateSubnetRange = () => {
      function ipToLong(ip) {
        return (
          ip
            .split(".")
            .reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
        );
      }

      function longToIp(long) {
        return [
          (long >>> 24) & 255,
          (long >>> 16) & 255,
          (long >>> 8) & 255,
          long & 255,
        ].join(".");
      }

      const ipLong = ipToLong(formData.subnet);
      const maskLong = ipToLong(formData.mask);

      const network = ipLong & maskLong;
      const broadcast = network | (~maskLong >>> 0);

      const firstUsable = network + 1;
      const lastUsable = broadcast - 1;

      if (lastUsable <= firstUsable) {
        return "No usable IPs in this subnet";
      }

      return `${longToIp(firstUsable)} - ${longToIp(lastUsable)}`;
    };

    if (formData.subnet && formData.mask) {
      const range = calculateSubnetRange();
      setFormData(prevData => ({
        ...prevData,
        subnetRange: range
      }));
    }
  }, [formData.subnet, formData.mask]);

  // Handle Generate key
  useEffect(() => {
    //' Handle key Genration
    const handleGenerateKey = async () => {
      if (formData.enableKey && formData.omapiAlgo) {
        try {
          const response = await axios.post(
            `http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/generateKey`,
            { omapialgo: formData.omapiAlgo }
          );
          setFormData(prevData => ({
            ...prevData,
            omapiKey: response.data.hmac_key
          }));
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (formData.enableKey && formData.omapiAlgo) {
      handleGenerateKey();
    } else if (!formData.enableKey) {
      setFormData(prevData => ({
        ...prevData,
        omapiKey: ""
      }));
    }
  }, [formData.enableKey, formData.omapiAlgo]);


  const serviceStatusManagement = () => {
    axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/status`).then((res) => {
      if (res.data === "active") {
        setdisableStart(true);
        setdisableRestart(false);
        setdisableStop(false);
      } else if (res.data === "inactive") {
        setdisableStart(false);
        setdisableRestart(true);
        setdisableStop(true);
      } else {
        setdisableStart(true);
        setdisableRestart(false);
        setdisableStop(true);
      }
    })
  };



  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    let newValue;

    switch (type) {
      case 'checkbox':
        newValue = checked;
        break;
      case 'file':
        newValue = files; // Or files[0] if single file
        break;
      default:
        newValue = value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleClick = (action) => {
    const actionOnService = action.trim();

    if (actionOnService !== "") {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/service`, {
        action: actionOnService
      })
        .then((res) => {
          console.log(res.data); // Optional: Log the success message
          serviceStatusManagement();
        })
        .catch((err) => {
          console.error("Service action failed:", err.response?.data || err.message);
          alert("❌ Failed to perform the action: " + (err.response?.data?.error || err.message));
        });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/save`, formData)
      .then((res) => {
        alert(res.data.message);
        setEnableButtonSet(true);
        serviceStatusManagement();
      })
      .catch((err) => {
        console.error("Error:", err);
        alert(err);
      });
  }

  return (
    <>
      <Sidebar />
      <div className="dhcp_container">

        <h1 style={{
          display: 'flex',
          justifyContent: !disableSubmitButton ? 'space-between' : 'center',
          alignItems: 'center',
          gap: '20px'
        }}>
          <span>DHCPv4 Server Configuration</span>

          {!disableSubmitButton && enableButtonset && (
            <span style={{ display: 'flex', gap: '80px' }}>
              <button onClick={() => handleClick('start')} disabled={disableStart}>Start</button>
              <button onClick={() => handleClick('restart')} disabled={disableRestart} >Restart</button>
              <button onClick={() => handleClick('stop')} disabled={disableStop} >Stop</button>
            </span>
          )}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* General setting */}
          <h2>General DHCP Settings</h2>

          <div className="dhcp_internal_container">
            <div className="dhcp_general_container">

              {/* DHCP Server Vendor Details */}
              <div className="dhcp_text">
                <label htmlFor="dhcpVendor">DHCP Backend:</label>
                <input
                  type="text"
                  name="dhcpVendor"
                  placeholder="DHCP vendor"
                  value="ISC DHCP"
                  readOnly
                ></input>
              </div>

              {/* Enable DHCP Server on LAN Interface */}
              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableInterface">Enable</label>
                  <input type="checkbox" name="enableInterface" checked={formData.enableInterface} onChange={handleChange} required />
                </div>
                <p>Enable DHCP server on LAN interface</p>
              </div>

              {/* Enable Bootp Queries to be ignored */}
              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableBootp">BOOTP</label>
                  <input type="checkbox" name="enableBootp" checked={formData.enableBootp} onChange={handleChange} />
                </div>
                <p>Ignore BOOTP queries</p>
              </div>

              {/* Type of Client DHCP request to  process */}
              <div className="dhcp_select">
                <label htmlFor="clientType">Deny Unknown Clients:</label>
                <select name="clientType" value={formData.clientType} onChange={handleChange}>
                  <option value="0">Allow all clients</option>
                  <option value="1">
                    Allow known clients from any interface
                  </option>
                  <option value="2">
                    Allow known clients from only this interface
                  </option>
                </select>
              </div>

              {/* Enable Ignore denied Client Request */}
              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableIgnDeniedClient">Ignore Denied Clients</label>
                  <input
                    type="checkbox"
                    name="enableIgnDeniedClient"
                    checked={formData.enableIgnDeniedClient}
                    onChange={handleChange}
                  />
                </div>
                <p>Ignore denied clients rather than reject</p>
              </div>

              {/* Enable ignore Client Identifier in client's lease database */}
              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableIgnClientIdentfier">
                    Ignore Client Identifiers
                  </label>
                  <input type="checkbox" name="enableIgnClientIdentfier" checked={formData.enableIgnClientIdentfier} onChange={handleChange} />
                </div>
                <p>
                  Do not record a unique identifier (UID) in client lease database if present in client DHCP request
                </p>
              </div>
            </div>
          </div>


          {/* Primary address pool */}
          <h2>Primary Address Pool</h2>

          <div className="dhcp_internal_container">
            <div className="dhcp_primary_container">

              {/* Subnet of LAN Network */}
              <div className="dhcp_text">
                <label htmlFor="subnet">Subnet: </label>
                <input type="text" name="subnet" value={formData.subnet} onChange={handleChange} required />
              </div>

              {/* Mask of the LAN Network */}
              <div className="dhcp_text">
                <label htmlFor="mask">Subnet Mask: </label>
                <input type="text" name="mask" value={formData.mask} onChange={handleChange} required />
              </div>

              {/* Range of available IP address in LAN subnet */}
              <div className="dhcp_text">
                <label htmlFor="subnetRange">Subnet Range: </label>
                <input type="text" name="subnetRange" value={formData.subnetRange} onChange={handleChange} readOnly />
              </div>

              {/* Range of IP address from starting to ending for Primary Pool range  */}
              <div className="dhcp_text">
                <label className="dhcp_special_text">Address pool range:</label>
                <br></br>
                <br></br>
                <label htmlFor="rangesStart">From</label>
                <br></br>
                <input type="text" name="rangeStart" value={formData.rangeStart} onChange={handleChange}
                  pattern="^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"
                  required
                ></input>
                <br></br>
                <br></br>
                <label htmlFor="rangeEnd">To</label>
                <br></br>
                <input type="text" name="rangeEnd" value={formData.rangeEnd} onChange={handleChange}
                  pattern="^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"
                  required
                ></input>
              </div>

              {/* For addition IP pool  */}
              {/* <div className="dhcp_add_btn">
                <label htmlFor="additional_pool">Additional Pools</label>
                <button
                  onClick={() => {
                    // Write a custom function to add more address pool if someone click this button
                  }}
                >
                  <span>&#43;</span> Add Address Pool
                </button>
              </div> */}
            </div>
          </div>


          {/* Server setting */}
          <h2>Server Settings</h2>
          <div className="dhcp_internal_container">
            <div className="dhcp_server_container">

              {/* Netbios server options for Seamless Communication  and Booting over Internet*/}
              <div className="dhcp_text">
                <label htmlFor="wins1">WINS Servers</label>
                <input type="text" name="wins1" placeholder="WINS Server 1" value={formData.wins1} onChange={handleChange} ></input>
                <input type="text" name="wins2" placeholder="WINS Server 2" value={formData.wins2} onChange={handleChange}   ></input>
              </div>

              {/* Domain Name Resolving server address Global or Local  */}
              <div className="dhcp_text">
                <label htmlFor="dns1">DNS Servers</label>
                <input type="text" name="dns1" placeholder="DNS Server 1" value={formData.dns1} onChange={handleChange} pattern="^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$" />
                <input type="text" name="dns2" placeholder="DNS Server 2" value={formData.dns2} onChange={handleChange} pattern="^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$" />
                <input type="text" name="dns3" placeholder="DNS Server 3" value={formData.dns3} onChange={handleChange} pattern="^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$" />
                <input type="text" name="dns4" placeholder="DNS Server 4" value={formData.dns4} onChange={handleChange} pattern="^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$" />
              </div>
            </div>
          </div>


          {/* OMAPI */}
          <h2>   OMAPI</h2>

          <div className="dhcp_internal_container">
            <div className="dhcp_omapi_container">

              {/* OMAPI Port  */}
              <div className="dhcp_text">
                <label htmlFor="omapiPort">OMAPI Port</label>
                <input type="number" name="omapiPort" placeholder="OMAPI Port  e.g,7911" value={formData.omapiPort} min={1024} max={65555} onChange={handleChange} />
              </div>

              {/* OMAPI Key  */}
              <div className="dhcp_text">
                <label htmlFor="omapiKey">OMAPI Key</label>
                <input type="text" name="omapiKey" placeholder="OMAPI Key" value={formData.omapiKey} onChange={handleChange} />
                <div className="dhcp_checkbox">
                  <label htmlFor="enableKey">Generate New Key</label>
                  <input type="checkbox" name="enableKey" checked={formData.enableKey} onChange={handleChange} />
                </div>
                <p>Generate a new key based one selected algorithm</p>
              </div>

              {/* For selecting an algorithm for key generation */}
              <div className="dhcp_select">
                <label htmlFor="omapiAlgo">Key Algorithm</label>
                <select name="omapiAlgo" value={formData.omapiAlgo} onChange={handleChange}     >
                  <option value="1">HMAC-MD5 (legacy default)</option>
                  <option value="2">HMAC-SHA1</option>
                  {/* <option value="3">HAMC-SHA224</option>
                      <option value="4">HAMC-SHA224</option>
                      <option value="5">HAMC-SHA256 (current bind9 default)  </option>
                      <option value="6">HAMC-SHA384</option>
                      <option value="7">HAMC-SHA512</option> */}
                </select>
              </div>
            </div>
          </div>


          {/* Other DHCP Settings */}
          <h2>
            Other DHCP Settings</h2>

          <div className="dhcp_internal_container">
            <div className="dhcp_other_container">

              {/* Gateway  */}
              <div className="dhcp_text">
                <label htmlFor="gateway">Gateway:</label>
                <input type="text" name="gateway" value={formData.gateway} onChange={handleChange} />
              </div>

              {/* Domain Name  */}
              <div className="dhcp_text">
                <label htmlFor="domainName">Domain Name:</label>
                <input type="text" name="domainName" placeholder="Domain Name " value={formData.domainName} onChange={handleChange} />
              </div>

              {/* Domain Search List  */}
              <div className="dhcp_text">
                <label htmlFor="domainSearchList">Domain Search List:</label>
                <input type="text" name="domainSearchList" placeholder="example.com" value={formData.domainSearchList} onChange={handleChange} />
              </div>

              <div className="dhcp_number">
                <label htmlFor="defaultLeaseTime">Default Lease Time:</label>
                <input type="number" name="defaultLeaseTime" value={formData.defaultLeaseTime} onChange={handleChange} />
              </div>

              <div className="dhcp_number">
                <label htmlFor="maxLeaseTime">Maximum Lease Time:</label>
                <input type="number" name="maxLeaseTime" value={formData.maxLeaseTime} onChange={handleChange} />
              </div>

              {/* <div className="dhcp_text">
                    <label htmlFor="failover_ip">Failover peer IP:</label>
                    <input
                      type="text"
                      name="failover_ip"
                      placeholder="192.168.x.x"
                      value={failoverpeerip}
                      onChange={(e) => {
                        setFailOverPeerIp(e.target.value);
                        const pattern =
                          /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
                        setIsValid(
                          (pattern.test(e.target.value) &&
                            e.target.value.trim() !== "") ||
                            e.target.value.trim() === ""
                        );
                      }}
                    ></input>
                  </div> */}

              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableStaticArp">Static ARP:</label>
                  <input
                    type="checkbox"
                    name="enableStaticArp"
                    checked={formData.enableStaticArp}
                    onChange={handleChange}
                  ></input>
                </div>
                <p>Enable Static ARP enteries</p>
              </div>

              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableChangeTimeFormat">Time Format Change:</label>
                  <input
                    type="checkbox"
                    name="enableChangeTimeFormat"
                    checked={formData.enableChangeTimeFormat}
                    onChange={handleChange}
                  />
                  <p>Change DHCP display lease time from UTC to local time</p>
                </div>
              </div>

              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="enableStatisticsGraph">Statistics graphs:</label>
                  <input
                    type="checkbox"
                    name="enableStatisticsGraph"
                    checked={formData.enableStatisticsGraph}
                    onChange={handleChange}
                  />
                </div>
                <p>Enable monitoring graphs for DHCP lease statistics</p>
              </div>

              <div className="dhcp_checkbox">
                <div>
                  <label htmlFor="disablePingCheck">Ping check:</label>
                  <input
                    type="checkbox"
                    name="disablePingCheck"
                    checked={formData.disablePingCheck}
                    onChange={handleChange}
                  />
                </div>
                <p>Disable ping check</p>
              </div>

              {formData.disablePingCheck ? (
                <div className="dhcp_text">
                  <div>
                    <label htmlFor="pingTimeout">Ping Timeout:</label>
                    <input
                      type="number"
                      name="pingTimeout"
                      placeholder="value in seconds"
                      value={formData.pingTimeout}
                      onChange={handleChange}
                    />
                  </div>
                </div>

              ) : (
                <></>
              )}


              {/* <DynamicDNS />
                  <MACAddressControl />
                  <NTP />
                  <TFTP />
                  <LDAP />
                  <NetworkBooting />
                  <CustomDHCP /> */}
            </div>
          </div>


          <div className="dhcp_btn_container">
            <button
              type="submit"
              disabled={disableSubmitButton}
              className="dhcp_save_btn"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <StaticMappings/>
    </>
  );
}

export default DHCPConfiguration;
