import React, { useState } from "react";
import '../pages/dhcp_configuration.css';
const DynamicDNS = () => {
  const [data, setData] = useState([false, null]);


  const [enableddns, setEnableDDNS] = useState(false);
  const [ddnsdomain,setDDNSDomain]=useState('');
  const [enableDDNSHostname,setEnableHostName]=useState(false);
  const [primaryDDNSserver,setPrimaryDDNsServer]=useState('');
  const [secondaryDDNSserver,setSecondaryDDNSServer]=useState('');
  const [ddnsdomainkey,setDDNSDomainKey]=useState('');
  const [ddnskeyalgo,setDDNSKeyAlgo]=useState(1);
  const [ddnsdomainkeysecret,setDDNSDomainKeySecret]=useState('');
  const [enableclientupdates,setClientUpdates]=useState(1);
  
  return (
    <div className="dhcp_comp_container">
      <label >Dynamic DNS:</label>
      <button onClick={() => setData((prevContent)=>[!prevContent[0], null])}>
        <span>&#9965;</span> <span>{data[0] ? 'Hide' : 'Display'}</span> Advanced
      </button>
      {
        data[0] &&<>
          <div className="dhcp_comp_internal_container">
            <div className="dhcp_checkbox">
              
              <div>
                <label>Enable</label>
                <input type="checkbox" checked={enableddns} onChange={(e) => setEnableDDNS(e.target.checked)}></input>
              </div>
              <p>Enable DDNS registration of DHCP clients</p>
            </div>

            <div className="dhcp_text">
              <label>DDNS Domain:</label>
              <input type="text" placeholder="home.arpa" value={ddnsdomain} onChange={(e)=>setDDNSDomain(e.target.value)}></input>
            </div>
            <div className="dhcp_checkbox">
              <div>
                <label>DDNS Hostnames</label>
                <input type="checkbox" checked={enableDDNSHostname} onChange={(e) => setEnableHostName(e.target.checked)}></input>
              </div>
              <p>Force dynamic DNS hostname to be same as <br></br>configured
                hostname for Static Mappings</p>
            </div>
            <div className="dhcp_text">
              <label>Primary DDNS Server:</label>
              <input type="text" value={primaryDDNSserver} onChange={(e)=>setPrimaryDDNsServer(e.target.value)}></input>
            </div>
            <div className="dhcp_text">
              <label>Secondary DDNS Server:</label>
              <input type="text" value={secondaryDDNSserver} onChange={(e)=>setSecondaryDDNSServer(e.target.value)}></input>
            </div>
            <div className="dhcp_text">
              <label>DNS Domain Key:</label>
              <input type="text" value={ddnsdomainkey} onChange={(e)=>setDDNSDomainKey(e.target.value)}></input>
            </div>
            <div className="dhcp_select">
              <label>Key Algorithm:</label>
              <select value={ddnskeyalgo} onChange={(e)=>setDDNSKeyAlgo(e.target.value)}>
                {/* Here i need to check how many options are there */}
                <option value="1">HMAC-MD5(legacy default)</option>
                <option value="2">option 2</option>
                <option value="3">option 3</option>
              </select>
            </div>
            <div className="dhcp_text">
              <label>DNS Domain Key Secret:</label>
              <input type="text" placeholder="base64 encoded string" value={ddnsdomainkeysecret} onChange={(e)=>setDDNSDomainKeySecret(e.target.value)}></input>
            </div>
            <div className="dhcp_select">
              <label>DDNS Client Updates:</label>
              <select value={enableclientupdates} onChange={(e)=>setClientUpdates(e.target.value)}>
                {/* Here i need to check how many options are there */}
                <option value="0">Allow</option>
                <option value="1">option 2</option>
                <option value="2">option 3</option>
              </select>
            </div>
          </div>
        </> 
      }
    </div>

  );
};

export default DynamicDNS;