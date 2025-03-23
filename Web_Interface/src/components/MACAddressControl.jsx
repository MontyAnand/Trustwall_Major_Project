import React, { useState } from "react";
import '../pages/dhcp_configuration.css';
const  MACAddressControl= ()=>{
    const [data,setData] = useState([true,null]);
    return(
        <div className="dhcp_comp_container">
            <label>MAC Address Control:</label>
            <button onClick={()=>{
                data[0]?(
                    setData([false,
                        <div className="dhcp_comp_internal_container">
                            <div className="dhcp_text">
                                <label>MAC Allow:</label>
                                <input type="text" placeholder="00:11:22:33:44:55:66:77:88:99:AA"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>MAC Deny:</label>
                                <input type="text" placeholder="00:11:22:33:44:55:66:77:88:99:AA"></input>
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

export default MACAddressControl;