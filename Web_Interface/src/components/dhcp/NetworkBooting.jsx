import React, { useState } from "react";
import '../pages/dhcp_configuration.css';

const NetworkBooting = () => {
    const [data, setData] = useState([false, null]);

    const [enablenetworkbooting,setEnableNetworkBooting]=useState(false);
    const [nextserver,setNextServer]=useState('');
    const [defaultbiosfilename,setDefaultBIOSFileName]=useState('');
    const [uefi32bitfilename,setUEFI32BitFileName]=useState('');
    const [uefi64bitfilename,setUEFI64BitFileName]=useState('');
    const [arm32bitfilename,setARM32BitFileName]=useState('');
    const [arm64bitfilename,setARM64BitFileName]=useState('');
    const [uefihttpbooturl,setUEFIHttpBootURL]=useState('');
    const [rootpath,setRootPath]=useState('');
    return (
        <div className="dhcp_comp_container">
            <label >Network Booting:</label>
            <button onClick={() => setData((prevContent) => [!prevContent[0], null])}>
                <span>&#9965;</span> <span>{data[0] ? 'Hide' : 'Display'}</span> Advanced
            </button>
            {
                data[0] &&
                <div className="dhcp_comp_internal_container">
                    <div className="dhcp_checkbox">
                        <div>
                            <label>Enable</label>
                            <input type="checkbox" checked={enablenetworkbooting} onChange={(e)=>setEnableNetworkBooting(e.target.checked)}></input>
                        </div>
                        <p>Enable Network Booting</p>
                    </div>
                    <div className="dhcp_text">
                        <label>Next Server:</label>
                        <input type="text" value={nextserver} onChange={(e)=>setNextServer(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>Default BIOS File Name:</label>
                        <input type="text" value={defaultbiosfilename} onChange={(e)=>setDefaultBIOSFileName(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>UEFI 32 bit File Name:</label>
                        <input type="text" value={uefi32bitfilename} onChange={(e)=>setUEFI32BitFileName(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>UEFI 64 bit File Name:</label>
                        <input type="text" value={uefi64bitfilename} onChange={(e)=>setUEFI64BitFileName(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>ARM 32 bit File Name:</label>
                        <input type="text" value={arm32bitfilename} onChange={(e)=>setARM32BitFileName(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>ARM 64 bit File Name:</label>
                        <input type="text" value={arm64bitfilename} onChange={(e)=>setARM64BitFileName(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>UEFI HTTPBoot URL:</label>
                        <input type="text" value={uefihttpbooturl} onChange={(e)=>setUEFIHttpBootURL(e.target.value)}></input>
                    </div>
                    <div className="dhcp_text">
                        <label>Root Path:</label>
                        <input type="text" value={rootpath} onChange={(e)=>setRootPath(e.target.value)}></input>
                    </div>
                </div>
            }
        </div>
    );
};

export default NetworkBooting;