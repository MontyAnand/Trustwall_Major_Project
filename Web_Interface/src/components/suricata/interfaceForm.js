import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import './interfaceForm.css';

const InterfaceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit
  const [formData, setFormData] = useState({
    enableInterface: false,
    interface: "",
    status: "inactive",
    description: "",
    enableStart: false,
    enableStop: true,
    enableRestart: true,
    enableAlertsToSystemLog: true,
    enableStatsCollection: true,
    enableHTTPLog: false,
    httpLogFileType: "regular",
    enableAppendHTTPLog: false,
    enableLogExtendedHTTPinfo: false,
    enableTLSLog: false,
    enableFILEStore: false,
    enablePacketLog: false,
    enableVerboseLog: false,
    enableEVEJSONLog: true,
    // enableBlockOffenders: "",
    runMode: "workers",
    maxPendingPackets: 1024,
    detectEngineProfile: "medium",
    multiPatternMatcherAlgo: "auto",
    singlePatternMatcherAlgo: "auto",
    signatureGroupHeaderMPM: "auto",
    inspectionRecursionLimit: 3000,
    // enableDelayedDetect: "",
    // enablePromiscuousMode: "",
    // interfaceSNAPLen: 1518,
    homeNet: "",
    externalNet: "",
    // alertSuppressionandFiltering: ""
  });
  // const [interfaces, setInterfaces] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces/${id}`).then((res) => {
        setFormData(res.data);
      });
    }
  }, [id, formData.enableInterface, formData.interface]);

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


  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      formData.enableRestart=false;
      formData.enableStart=true;
      formData.enableStop=false;
      axios.put(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces/${id}`, formData).then(() => navigate("/suricata"));
    } else {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:5000/suricata/api/interfaces`, formData)
        .then((res) => {
          console.log(res.data.message);
        })
        .then(() => navigate("/suricata"));
    }
  };



  // const fetchInterfaces = () => {
  //   fetch('http://localhost:5000/api/interfaces-info')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setInterfaces(data.interfaces);
  //     })
  //     .catch((err) => console.error('Error fetching interfaces:', err));
  // };

  // useEffect(() => {
  //   fetchInterfaces(); // Initial fetch
  //   const interval = setInterval(fetchInterfaces, 5000); // Poll every 5 sec
  //   return () => clearInterval(interval); // Cleanup
  // }, []);

  // useEffect(() => {
  //   fetch(`http://localhist:5000/laninfo`)
  //     .then((res) => res.json())
  //     .then((data) => {

  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch network info:", err);
  //     });
  // }, []);




  return (
    <div className="container">
      <h2>{id ? "Edit Interface" : "Add Interface"}</h2>
      <form onSubmit={handleSubmit}>

        <h1>General Settings</h1>

        <div className="section">
          <label>Enable&emsp;&emsp;</label>
          <input type="checkbox" name="enableInterface" checked={formData.enableInterface} onChange={handleChange} required />
          <label>&ensp;Checking this box enables Suricata Inspection on this interface</label>
        </div>

        {/* need some adjustments */}
        <div className="section">
          <label>Interface&emsp;&emsp;</label>
          <select name="interface" value={formData.interface} onChange={handleChange} required>
            <option value={""}>--- select a interface ---</option>
            <option value={"WAN"}>WAN</option>
            <option value={"LAN"}>LAN</option>
            {/* make dynamic dropdown */}

            {/* {interfaces.map((iface) => (
              <option key={iface} value={iface}>
                {iface}
              </option>
            ))} */}
          </select>

        </div>


        <div className="section">
          <label>Description&emsp;&emsp;</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        </div>



        {/* Logging related settings */}
        <h1>Logging Settings</h1>

        <div className="section">
          <label>Send Alerts to System Log&emsp;&emsp;</label>
          <input type="checkbox" name="enableAlertsToSystemLog" checked={formData.enableAlertsToSystemLog} onChange={handleChange} />
          <label>&ensp;Suricata will send Alerts from this interface to the firewall's system log</label>
        </div>

        <div className="section">
          <label>Enable Stats Collection&emsp;&emsp;</label>
          <input type="checkbox" name="enableStatsCollection" checked={formData.enableStatsCollection} onChange={handleChange} />
          <label>&ensp;Suricata will periodically gather performance statistics for this interface.Default is not checked</label>
        </div>

        <div className="section">
          <label>Enable HTTP Log&emsp;&emsp;</label>
          <input type="checkbox" name="enableHTTPLog" checked={formData.enableHTTPLog} onChange={handleChange} />
          <label>&ensp;Suricata will log decoded HTTP traffic for the interface.Default is not checked</label>
        </div>

        <div className="section">
          <label>HTTP Log File Type&emsp;&emsp;</label>
          <select name="httpLogFileType" value={formData.httpLogFileType} onChange={handleChange} >
            <option value={"regular"}>Regular</option>
            <option value={"unix_dgram"}>Datagram</option>
            <option value={"unix_stream"}>Stream</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Select 'Regular' to log to a conventional file, or choose UNIX 'Datagram' or 'Stream' Socket to log to an existing UNIX socket.Default is 'Regular'</label>
        </div>

        <div className="section">
          <label>Append HTTP Log&emsp;&emsp;</label>
          <input type="checkbox" name="enableAppendHTTPLog" checked={formData.enableAppendHTTPLog} onChange={handleChange} />
          <label>&ensp;Checking this box enables Suricata Inspection on this interface</label>
        </div>

        <div className="section">
          <label>Log Extended HTTP info&emsp;&emsp;</label>
          <input type="checkbox" name="enableLogExtendedHTTPinfo" checked={formData.enableLogExtendedHTTPinfo} onChange={handleChange} />
          <label>&ensp;Checking this box enables Suricata Inspection on this interface.</label>
        </div>

        <div className="section">
          <label>Enable TLS Log&emsp;&emsp;</label>
          <input type="checkbox" name="enableTLSLog" checked={formData.enableTLSLog} onChange={handleChange} />
          <label>&ensp;Suricata will log TLS handshake traffic for the interface.Default is Not checked.</label>
        </div>

        <div className="section">
          <label>Enable File-Store&emsp;&emsp;</label>
          <input type="checkbox" name="enableFILEStore" checked={formData.enableFILEStore} onChange={handleChange} />
          <label>&ensp;Suricata will extract and store files from application layer streams.Default is Not checked.<span style={{ color: 'red', fontWeight: 'bolder' }}>Warning: </span>Enabling file-store will consume a significant amount of disk space on a busy network!.</label>
        </div>

        <div className="section">
          <label>Enable Packet Log&emsp;&emsp;</label>
          <input type="checkbox" name="enablePacketLog" checked={formData.enablePacketLog} onChange={handleChange} />
          <label>&ensp;Suricata will log decoded packets for the interface in pcap-format.Default is Not checked.This can consume a significant amount of disk space when enabled.Use the packet Log Conditional setting below to select packets for capture.</label>
        </div>

        <div className="section">
          <label>Enable Verbose Log&emsp;&emsp;</label>
          <input type="checkbox" name="enableVerboseLog" checked={formData.enableVerboseLog} onChange={handleChange} />
          <label>&ensp;Suricata will log additional information to the suricata log file when strting up and shutting down.Default is Not checked.</label>
        </div>


        {/* eve output settings */}
        <h1>EVE Output Settings</h1>
        <div className="section">
          <label>EVE JSON Log&emsp;&emsp;</label>
          <input type="checkbox" name="enableEVEJSONLog" checked={formData.enableEVEJSONLog} onChange={handleChange} />
          <label>&ensp;Suricata will output selected info in JSON format to a single file or to syslog.Default is Not checked.</label>
        </div>

        {/* Alert and Block Settings */}
        {/* <h1>Alert and Block Settings</h1>
        <div className="section">
          <label>Block Offenders&emsp;&emsp;</label>
          <input type="checkbox" name="enableBlockOffenders" checked={formData.enableBlockOffenders} onChange={handleChange} />
          <label>&ensp;Checking this option will automatically block hosts that generate a Suricata alert.Default is Not checked.</label>
        </div> */}


        {/* performance and detection engine settings */}
        <h1>Performance and Detection Engine Settings</h1>
        <div className="section">
          <label>Run Mode&emsp;&emsp;</label>
          <select name="runMode" value={formData.runMode} onChange={handleChange} >
            <option value={"autofp"}>AutoFP</option>
            <option value={"workers"}>Workers</option>
            {/* <option value={"Single"}>Single</option> */}
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>Choose a Suricata run mode settings.Default is "AutoFP" and is the recommended setting for IDS-only."Workers" uses multiple worker threads, each of which processes the packets it acquires through all the deco0de and detect modules."Workers" runmode is preferred for Inline IPS Mode blocking because it offers superior peformance in that configuration."Single" uses only a thread for all operations , and is intended for use only in testing or development instances.</label>
        </div>

        <div className="section">
          <label>Max Pending Packets&emsp;&emsp;</label>
          <input type="number" name="maxPendingPackets" value={formData.maxPendingPackets} min={1} max={65000} onChange={handleChange} />
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Enter number of simultaneous packets to process.Default is 1024.This controls the number of simultaneous packets the engine can handle .Setting this higher generally keeps the threads busy.The minimum value is 1 and maximum value is 65,000.<span style={{ color: 'red', fontWeight: 'bolder' }}>Warning: </span>Set this too high can lead to degradation and a possible system crash by exhausting available memory.</label>
        </div>

        <div className="section">
          <label>Detect-Engine Profile&emsp;&emsp;</label>
          <select name="detectEngineProfile" value={formData.detectEngineProfile} onChange={handleChange} >
            <option value={"Medium"}>Medium</option>
            <option value={"High"}>High</option>
            <option value={"Low"}>Low</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>Choose a detection engine profile.Default is Medium.MEDIUM is recommended for most systems because it offers a good balance between memory and performance.LOW uses less memory,but it offers lower performance.HIGH consumes a large amount of memory but it offers the highest performance.</label>
        </div>

        <div className="section">
          <label>Multi-Pattern Matcher Algorithm&emsp;&emsp;</label>
          <select name="multiPatternMatcherAlgo" value={formData.multiPatternMatcherAlgo} onChange={handleChange} >
            <option value={"auto"}>Auto</option>
            <option value={"ac"}>Aho-Corasick</option>
            <option value={"ac-bs"}>Aho-Corasick (Reduced mMemory)</option>
            <option value={"ac-ks"}>Aho-Corasick,("Ken Steele" variant)</option>
            <option value={"hs"}>Hyperscan</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>Choose a multi-pattern matcher(MPM) algorithm.Auto is default and is best choice for almost all system.Auto will use Hyperscan if available else will use Aho-Corasick.</label>
        </div>

        <div className="section">
          <label>Single-Pattern Matcher Algorithm&emsp;&emsp;</label>
          <select name="singlePatternMatcherAlgo" value={formData.singlePatternMatcherAlgo} onChange={handleChange} >
            <option value={"auto"}>Auto</option>
            <option value={"bm"}>Boyer-Moore</option>
            <option value={"hs"}>Hyperscan</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>Choose a single-pattern matcher(SPM) algorithm.Auto is default and is best choice for almost all system.Auto will use Hyperscan if available else will use Boyer-Moore.</label>
        </div>

        <div className="section">
          <label>Signature Group Header MPM Context&emsp;&emsp;</label>
          <select name="signatureGroupHeaderMPM" value={formData.signatureGroupHeaderMPM} onChange={handleChange} >
            <option value={"auto"}>Auto</option>
            <option value={""}>Full</option>
            <option value={""}>Single</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>Choose a Signatuire Group Haeder multi-pattern matcher context.Default is Auto.AUTO means Suricata selects between Full and Single based on the MPM algorithm chosen.Full means every Signatures Group has its own MPM context.SINGLE means all signature Groups share a single MPM context.Using FULL can improve performance at the expense of significant memory consumption.</label>
        </div>

        <div className="section">
          <label>Inspection Recursion Limit&emsp;&emsp;</label>
          <input type="number" name="inspectionRecursionLimit" value={formData.inspectionRecursionLimit} onChange={handleChange} />
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Enter limit for recursive calls in context inspection code.Default is 3000</label>
        </div>

        {/* <div className="section">
          <label>Delayed Detect&emsp;&emsp;</label>
          <input type="checkbox" name="enableDelayedDetect" checked={formData.enableDelayedDetect} onChange={handleChange} />
          <label>&ensp;Checking this option will build list of signatures after packet capture threads have started.Default is Not checked.</label>
        </div>

        <div className="section">
          <label>Promiscuous Mode&emsp;&emsp;</label>
          <input type="checkbox" name="enablePromiscuousMode" checked={formData.enablePromiscuousMode} onChange={handleChange} />
          <label>&ensp;Checking this option will place the monitored interface in Promiscuous mode when checked.Default is checked.</label>

        </div>

        <div className="section">
          <label>Interface PCAP Snaplen&emsp;&emsp;</label>
          <input type="number" name="interfaceSNAPLen" value={formData.interfaceSNAPLen} onChange={handleChange} />
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Select 'Regular' to log to a conventional file, or choose UNIX 'Datagram' or 'Stream' Socket to log to an existing UNIX socket.Default is 'Regular'</label>
        </div> */}

        {/* Networks Suricata should Inspect and protect */}
        <h1>Networks Suricata should Inspect and protect</h1>

        <div className="section">
          <label>Home Net&emsp;&emsp;</label>
          <select name="homeNet" value={formData.homeNet} onChange={handleChange} >
            <option value={"default"}>default</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Select 'Regular' to log to a conventional file, or choose UNIX 'Datagram' or 'Stream' Socket to log to an existing UNIX socket.Default is 'Regular'</label>
        </div>

        <div className="section">
          <label>External Net&emsp;&emsp;</label>
          <select name="externalNet" value={formData.externalNet} onChange={handleChange} >
            <option value={"default"}>default</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Select 'Regular' to log to a conventional file, or choose UNIX 'Datagram' or 'Stream' Socket to log to an existing UNIX socket.Default is 'Regular'</label>
        </div>

        {/* Alert Suppression and Filtering */}
        {/* <h1>Alert Suppression and Filtering</h1>
        <div className="section">
          <label>Alert Suppression and Filtering&emsp;&emsp;</label>
          <select name="alertSuppressionandFiltering" value={formData.alertSuppressionandFiltering} onChange={handleChange} >
            <option value={"default"}>default</option>
          </select>
          <label style={{ fontSize: '0.85em', color: '#777' }}>&ensp;Select 'Regular' to log to a conventional file, or choose UNIX 'Datagram' or 'Stream' Socket to log to an existing UNIX socket.Default is 'Regular'</label>
        </div> */}

        {/* Submit button */}
        <div className="section">
          <button type="submit">{id ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};

export default InterfaceForm;
