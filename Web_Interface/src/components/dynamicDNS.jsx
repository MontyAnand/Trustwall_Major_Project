import React, { useState } from "react";
import '../pages/dhcp_configuration.css';
const DynamicDNS = ()=>{
    const [data,setData] = useState([true,null]);
    return(
        <div className="dhcp_comp_container">
            <label >Dynamic DNS:</label>
            <button onClick={()=>{
                data[0]?(
                    setData([false,
                        <div className="dhcp_comp_internal_container">
                            <div className="dhcp_checkbox">
                            <div>
                                <label>Enable</label>
                                <input type="checkbox"></input>
                            </div>
                            <p>Enable DDNS registration of DHCP clients</p>
                            </div>
                            <div className="dhcp_text">
                                <label>DDNS Domain:</label>
                                <input type="text" placeholder="home.arpa"></input>
                            </div>
                            <div className="dhcp_checkbox">
                            <div>
                                <label>DDNS Hostnames</label>
                                <input type="checkbox"></input>
                            </div>
                            <p>Force dynamic DNS hostname to be same as <br></br>configured
                            hostname for Static Mappings</p>
                            </div>
                            <div className="dhcp_text">
                                <label>Primary DDNS Server:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>Secondary DDNS Server:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>DNS Domain Key:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_select">
                            <label>Key Algorithm:</label>
                            <select>
                                {/* Here i need to check how many options are there */}
                                <option value="0">HMAC-MD5(legacy default)</option>
                                <option value="1">option 2</option>
                                <option value="2">option 3</option>
                            </select>
                            </div>
                            <div className="dhcp_text">
                                <label>DNS Domain Key Secret:</label>
                                <input type="text" placeholder="base64 encoded string"></input>
                            </div>
                            <div className="dhcp_select">
                            <label>DDNS Client Updates:</label>
                            <select>
                                {/* Here i need to check how many options are there */}
                                <option value="0">Allow</option>
                                <option value="1">option 2</option>
                                <option value="2">option 3</option>
                            </select>
                            </div>
                        </div>
                    ])
                )
                :(
                    setData([true,null])
                );
            }}>
            <span>&#9965;</span> <span>{data[0]?'Display':'Hide'}</span> Advanced
            </button>
            {data[1]}
        </div>
    );
};

export default DynamicDNS;