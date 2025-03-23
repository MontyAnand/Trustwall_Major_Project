import React, { useState } from "react";
import '../pages/dhcp_configuration.css';

const NetworkBooting = ()=>{
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
                            <p>Enable Network Booting</p>
                            </div>
                            <div className="dhcp_text">
                                <label>Next Server:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>Default BIOS File Name:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>UEFI 32 bit File Name:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>UEFI 64 bit File Name:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>ARM 32 bit File Name:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>ARM 64 bit File Name:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>UEFI HTTPBoot URL:</label>
                                <input type="text"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>Root Path:</label>
                                <input type="text"></input>
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

export default NetworkBooting;