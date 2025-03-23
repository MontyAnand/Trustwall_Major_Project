import React, { useState, useEffect } from "react";
import "./dhcp_configuration.css";
import DynamicDNS from "../components/dynamicDNS";
import MACAddressControl from "../components/MACAddressControl";
import NTP from "../components/NTP";
import TFTP from "../components/TFTP";
import LDAP from "../components/LDAP";
import NetworkBooting from "../components/NetworkBooting";
import CustomDHCP from "../components/customDHCP";
import axios from "axios";

function DHCPConfiguration() {
  // useState for main blocks 
  const [content1, setContent1] = useState([false, null]);
  const [content2, setContent2] = useState([false, null]);
  const [content3, setContent3] = useState([false, null]);
  const [content4, setContent4] = useState([false, null]);
  const [content5, setContent5] = useState([false, null]);

  //useState for all form elements
  const [interfacechecked, setInterfaceChecked] = useState(true);
  const [bootpchecked, setBootpChecked] = useState(true);
  const [isclientaccept, setIsClientAccept] = useState(2);
  const [isdenyclient, setIsDenyClient] = useState(true);
  const [isignclientname, setIsIgnClientname] = useState(true);

  const [subnet, setSubnet] = useState('192.168.1.0');
  const [mask, setMask] = useState('255.255.255.0');
  const [subnet_range, setSubnetRange] = useState('192.168.1.1-192.168.1.254');
  const [startIP, setStartIP] = useState('');
  const [endIP, setEndIP] = useState('');

  const [wins1, setWinS1] = useState('');
  const [wins2, setWinS2] = useState('');
  const [dns0, setDnS0] = useState('8.8.8.8');
  const [dns1, setDnS1] = useState('');
  const [dns2, setDnS2] = useState('');
  const [dns3, setDnS3] = useState('');

  const [omapiport, setOmapiPort] = useState('');
  const [omapikey, setOmapikKey] = useState('');
  const [checkkey, setCheckKey] = useState('');
  const [omapialgo, setOmapiAlgo] = useState('7');

  const [gateway, setGateway] = useState('192.168.1.1');
  const [domainname, setDomainName] = useState('');
  const [domainsearchlist, setDomainSearchList] = useState('');
  const [defaultleasetime, setDefaultLeaseTime] = useState('600');
  const [maxleasetime, setMaxLeaseTime] = useState('7200');
  const [failoverpeerip, setFailOverPeerIp] = useState('');
  const [enablestaticarp, setEnableStaticArp] = useState('');
  const [enablechangetimeformat, setEnableChangeTimeFormat] = useState('');
  const [enablestaticticsgraph, setEnableStaticticsGraph] = useState('');
  const [disablepingcheck, setDisablePingCheck] = useState('');

  //useState for controlling submit button's functionality
  const [isValid, setIsValid] = useState(true);
  const [issubmitbuttondisabled, setIsSubmitDisabled] = useState(true);

  //useEffect for controlling submit button's functionality and rendeing the updates
  useEffect(() => {
    if ((interfacechecked && startIP.trim() !== '' && endIP.trim() !== '')) {
      if (interfacechecked && isValid && isIpInSubnet(startIP, subnet, mask) && isIpInSubnet(endIP, subnet, mask)) {
        setIsSubmitDisabled(false);
      }
      else {
        setIsSubmitDisabled(true);
      }
    } else {
      setIsSubmitDisabled(true);
    }
  }, [interfacechecked, startIP, endIP, subnet, mask, isValid]);



  function handleSubmit() {
    const data = {
      Interface_enable: interfacechecked,
      Bootp_enable: bootpchecked,
      Deny_unknown_clients: isclientaccept,
      Ignore_client_identifier: isignclientname,
      Subnet: subnet,
      Subnet_mask: mask,
      // Subnet_range:subnet_range,
      StartIP: startIP,
      EndIP: endIP,
      Wins1: wins1,
      Wins2: wins2,
      Dns0: dns0,
      Dns1: dns1,
      Dns2: dns2,
      Dns3: dns3,
      Omapi_port: omapiport,
      Omapi_key: omapikey,
      Omapi_enable_algo: checkkey,
      Omapi_algorithm: omapialgo,
      Gateway: gateway,
      Domain_name: domainname,
      Domain_search_list: domainsearchlist,
      Default_lease_time: defaultleasetime,
      Maximum_lease_time: maxleasetime,
      Failover_peer_Ip: failoverpeerip,
      Static_arp_entries_enable: enablestaticarp,
      Dhcp_lease_time_format_UTC_to_Local_enable: enablechangetimeformat,
      Dhcp_lease_monitoring_stats_enable: enablestaticticsgraph,
      Ping_check_disable: disablepingcheck
    };

    //  Send data to backend using Fetch API
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:5000/dhcp/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }

  // Function to convert an IP address to binary
  function ipToBinary(ip) {
    return ip.split('.')
      .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
      .join('.');
  }

  // Function to convert a binary IP back to dotted decimal format
  // function binaryToIp(binaryIp) {
  //   return binaryIp.split('.')
  //     .map(binaryOctet => parseInt(binaryOctet, 2))
  //     .join('.');
  // }

  // Function to perform bitwise AND operation on two IPs
  function bitwiseAnd(ip1, ip2) {
    const binaryIp1 = ipToBinary(ip1).split('.');
    const binaryIp2 = ipToBinary(ip2).split('.');

    const andResult = binaryIp1.map((octet, index) => {
      // Perform AND operation on each octet
      return (parseInt(octet, 2) & parseInt(binaryIp2[index], 2)).toString(2).padStart(8, '0');
    });

    return andResult.join('.');
  }

  // Function to check if an IP is in a subnet
  function isIpInSubnet(ip, subnetIp, subnetMask) {
    const andResult = bitwiseAnd(ip, subnetMask); // Perform AND operation between IP and subnet mask
    const networkAddress = bitwiseAnd(subnetIp, subnetMask); // Get the network address of the subnet

    return andResult === networkAddress;
  }

  //' Handle key Genration
  const handleGenerateKey = async () => {
    if (checkkey && omapialgo) {
      try {
        const response = await axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/generateKey`, { omapialgo });
        setOmapikKey(response.data.algorithm);
      } catch (error) {
        console.error(error);
      }
    }
  };

 // Handle Generate key
  useEffect(() => {
    if (checkkey && omapialgo) {
      handleGenerateKey();
    }
    else if(!checkkey){
      setOmapikKey('');
    }
  }, [checkkey, omapialgo]);

  return (
    <div className="dhcp_container">
      <h1>DHCPv4 Server Configuration</h1>
      {/* General setting */}
      <h2
        onClick={() =>
          setContent1((prevContent) => [
            !prevContent[0], null
          ])
        }
      >
        General DHCP Options
      </h2>
      {content1[0] ? <>{
        <div className="dhcp_internal_container">
          <div className="dhcp_general_container">

            <div className="dhcp_text">
              <label htmlFor="dhcp_vendor">DHCP Backend:</label>
              <input type="text" name="dhcp_vendor" placeholder="DHCP vendor" value="ISC DHCP" readOnly></input>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="interface">Enable</label>
                <input type="checkbox" name="interface" checked={interfacechecked} onChange={(e) => setInterfaceChecked(e.target.checked)} ></input>
              </div>
              <p>Enable DHCP server on LAN interface</p>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="bootp">BOOTP</label>
                <input type="checkbox" name="bootp" checked={bootpchecked} onChange={(e) => setBootpChecked(e.target.checked)} ></input>
              </div>
              <p>Ignore BOOTP queries</p>
            </div>

            <div className="dhcp_select">
              <label htmlFor="client_accept">Deny Unknown Clients:</label>
              <select name="client_accept" value={isclientaccept} onChange={(e) => setIsClientAccept(e.target.value)} >
                <option value="0">Allow all clients</option>
                <option value="1">Allow all clients from any interface</option>
                <option value="2">Allow clients from only this interface</option>
              </select>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="deny_client">Ignore Denied Clients</label>
                <input type="checkbox" name="deny_client" checked={isdenyclient} onChange={(e) => setIsDenyClient(e.target.checked)}></input>
              </div>
              <p>Ignore denied clients rather than reject</p>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="ign_client_name">Ignored Client Identifiers</label>
                <input type="checkbox" name="ign_client_name" checked={isignclientname} onChange={(e) => setIsIgnClientname(e.target.checked)} ></input>
              </div>
              <p>
                Do not record a unique nameentifier(Uname) in client <br></br>
                lease data if present in client DHCP request
              </p>
            </div>

          </div>
        </div>
      }</> : <></>}
      {/* Primary address pool */}
      <h2
        onClick={() =>
          setContent2((prevContent) => [
            !prevContent[0], null
          ])
        }
      >
        Primary Address Pool
      </h2>
      {content2[0] ? <>{
        <div className="dhcp_internal_container">
          <div className="dhcp_primary_container">

            <div className="dhcp_text">
              <label htmlFor="subnet">Subnet: </label>
              <input type="text" name="subnet" value={subnet} onChange={(e) => setSubnet(e.target.value)} readOnly></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="mask" >Subnet Mask: </label>
              <input type="text" name="mask" value={mask} onChange={(e) => setMask(e.target.value)} readOnly></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="subnet_range">Subnet Range: </label>
              <input type="text" name="subnet_range" value={subnet_range} onChange={(e) => setSubnetRange(e.target.value)} readOnly></input>
            </div>

            <div className="dhcp_text">
              <label className="dhcp_special_text">Address pool range:</label>
              <br></br><br></br>
              <label htmlFor="startIP">From</label>
              <br></br>
              <input type="text" name="startIP" value={startIP} onChange={(e) => {
                const pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
                setStartIP(e.target.value);
                setIsValid((pattern.test(e.target.value) && e.target.value.trim() !== '') || (e.target.value.trim() === ''));
              }}></input>

              <br></br><br></br>
              <label htmlFor="endIP">To</label>
              <br></br>
              <input type="text" name="endIP" value={endIP} onChange={(e) => {
                const pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
                setEndIP(e.target.value);
                setIsValid(pattern.test(e.target.value) && e.target.value.trim() !== '');
              }} ></input>
            </div>

            <div className="dhcp_add_btn">
              <label htmlFor="additional_pool">Additional Pools</label>
              <button
                onClick={() => {
                  // Write a custom function to add more address pool if someone click this button
                }}
              >
                <span>&#43;</span> Add Address Pool
              </button>
            </div>

          </div>
        </div>
      }</> : <></>}
      {/* Server setting */}
      <h2
        onClick={() =>
          setContent3((prevContent) => [
            !prevContent[0], null
          ])
        }
      >
        Server Options
      </h2>
      {content3[0] ? <>{
        <div className="dhcp_internal_container">
          <div className="dhcp_server_container">

            <div className="dhcp_text">
              <label htmlFor="wins_servers">WINS Servers</label>
              <input type="text" name="wins1" placeholder="WINS Server 1" value={wins1} onChange={(e) => setWinS1(e.target.value)}></input>
              <input type="text" name="wins2" placeholder="WINS Server 2" value={wins2} onChange={(e) => setWinS2(e.target.value)}></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="dns_servers">DNS Servers</label>
              <input type="text" name="gateway" value={dns0} onChange={(e) => setDnS0(e.target.value)} readOnly ></input>
              <input type="text" name="dns1" placeholder="DNS Server 1" value={dns1} onChange={(e) => setDnS1(e.target.value)}></input>
              <input type="text" name="dns2" placeholder="DNS Server 2" value={dns2} onChange={(e) => setDnS2(e.target.value)}></input>
              <input type="text" name="dns3" placeholder="DNS Server 3" value={dns3} onChange={(e) => setDnS3(e.target.value)}></input>
            </div>
          </div>
        </div>
      }</> : <></>}

      {/* OMAPI */}
      <h2
        onClick={() =>
          setContent4((prevContent) => [
            !prevContent[0], null
          ])
        }
      >
        OMAPI
      </h2>
      {content4[0] ? <>{
        <div className="dhcp_internal_container">
          <div className="dhcp_omapi_container">

            <div className="dhcp_text">
              <label htmlFor="omapi_port">OMAPI Port</label>
              <input type="text" name="omapi_port" placeholder="OMAPI Port  e.g,7911" value={omapiport} onChange={(e) => setOmapiPort
                (e.target.value)}></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="omapi_key">OMAPI Key</label>
              <input type="text" name="omapi_key" placeholder="OMAPI Key" value={omapikey} onChange={(e) => setOmapikKey(e.target.value)}></input>
              <div className="dhcp_checkbox">
                <label htmlFor="algo_key">Generate New Key</label>
                <input type="checkbox" name="algo_key" checked={checkkey} onChange={(e) => setCheckKey(e.target.checked)}></input>
              </div>
              <p>Generate a new key based one selected algorithm</p>
            </div>

            <div className="dhcp_select">
              <label htmlFor="Algorithm_names">Key Algorithm</label>
              <select name="Algorithm_names" value={omapialgo} onChange={(e) => setOmapiAlgo(e.target.value)}>
                <option value="1">HMAC-MD5 (legacy default)</option>
                <option value="2">HMAC-SHA1</option>
                <option value="3">HAMC-SHA224</option>
                <option value="4">HAMC-SHA224</option>
                <option value="5">HAMC-SHA256 (current bind9 default)</option>
                <option value="6">HAMC-SHA384</option>
                <option value="7">HAMC-SHA512</option>
              </select>
            </div>
          </div>
        </div>
      }</> : <></>}

      {/* Other DHCP options */}
      <h2
        onClick={() =>
          setContent5((prevContent) => [
            !prevContent[0], null
          ])
        }
      >
        Other DHCP Options
      </h2>
      {content5[0] ? <>{
        <div className="dhcp_internal_container">
          <div className="dhcp_other_container">

            <div className="dhcp_text">
              <label htmlFor="gateway">Gateway:</label>
              <input type="text" name="gateway" value={gateway} onChange={(e) => setGateway(e.target.value)} readOnly></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="domainName">Domain Name:</label>
              <input type="text" name="domainName" placeholder="home arpa" value={domainname} onChange={(e) => setDomainName(e.target.value)}></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="domain_search">Domain Search List:</label>
              <input type="text" name="domain_search" placeholder="example.com" value={domainsearchlist} onChange={(e) => setDomainSearchList(e.target.value)}></input>
            </div>

            <div className="dhcp_number">
              <label htmlFor="lease_time">Default Lease Time:</label>
              <input type="number" name="lease_time" value={defaultleasetime} onChange={(e) => setDefaultLeaseTime(e.target.value)}></input>
            </div>

            <div className="dhcp_number">
              <label htmlFor="max_lease_time">Maximum Lease Time:</label>
              <input type="number" name="max_lease_time" value={maxleasetime} onChange={(e) => setMaxLeaseTime(e.target.value)}></input>
            </div>

            <div className="dhcp_text">
              <label htmlFor="failover_ip">Failover peer IP:</label>
              <input type="text" name="failover_ip" placeholder="192.168.x.x" value={failoverpeerip} onChange={(e) => setFailOverPeerIp(e.target.value)}></input>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="enable_static_arp">Static ARP:</label>
                <input type="checkbox" name="enable_static_arp" checked={enablestaticarp} onChange={(e) => setEnableStaticArp(e.target.checked)}></input>
              </div>
              <p>Enable Static ARP enteries</p>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="time_format">Time Format Change:</label>
                <input type="checkbox" name="time_format" checked={enablechangetimeformat} onChange={(e) => setEnableChangeTimeFormat
                  (e.target.checked)}></input>
              </div>
              <p>Change DHCP display lease time from UTC to local time</p>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="enable_stats">Statistics graphs:</label>
                <input type="checkbox" name="enable_stats" checked={enablestaticticsgraph} onChange={(e) => setEnableStaticticsGraph(e.target.checked)}></input>
              </div>
              <p>Enable monitoring graphs for DHCP lease statistics</p>
            </div>

            <div className="dhcp_checkbox">
              <div>
                <label htmlFor="ping_check">Ping check:</label>
                <input type="checkbox" name="ping_check" checked={disablepingcheck} onChange={(e) => setDisablePingCheck(e.target.checked)}></input>
              </div>
              <p>Disable ping check</p>
            </div>

            <DynamicDNS/>
            <MACAddressControl/>
            <NTP/>
            <TFTP/>
            <LDAP/>
            <NetworkBooting/>
            <CustomDHCP/>

          </div>
        </div>
      }</> : <></>}
      <div className="dhcp_btn_container">
        <button type="button" disabled={issubmitbuttondisabled} onClick={handleSubmit} className="dhcp_save_btn">
          Save Configuration
        </button>
      </div>
    </div>
  );
}

export default DHCPConfiguration;
