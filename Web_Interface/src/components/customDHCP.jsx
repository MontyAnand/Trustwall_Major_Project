import React, { useState } from "react";
import '../pages/dhcp_configuration.css';
import CustomDHCPBtn from "./customDHCPbtn";

const CustomDHCP = ()=>{
    const [data,setData] = useState([true,null]);
    return(
        <div className="dhcp_comp_container">
            <label >Custom DHCP Options:</label>
            <button onClick={()=>{
                data[0]?(
                    setData([false,
                        <div className="dhcp_comp_internal_container">
                           <h2>Custom DHCP Options</h2>
                            <CustomDHCPBtn/>
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

export default CustomDHCP;