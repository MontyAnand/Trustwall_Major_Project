import React, { useState } from "react";
import '../pages/dhcp_configuration.css';

const NTP= ()=>{
    const [data,setData] = useState([true,null]);
    return(
        <div className="dhcp_comp_container">
            <label>NTP:</label>
            <button onClick={()=>{
                data[0]?(
                    setData([false,
                        <div className="dhcp_comp_internal_container">
                            <div className="dhcp_text">
                                <label>NTP Server 1:</label>
                                <input type="text" placeholder="NTP Server 1"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>NTP Server 2:</label>
                                <input type="text" placeholder="NTP Server 2"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>NTP Server 3:</label>
                                <input type="text" placeholder="NTP Server 3"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>NTP Server 4:</label>
                                <input type="text" placeholder="NTP Server 4"></input>
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

export default NTP;