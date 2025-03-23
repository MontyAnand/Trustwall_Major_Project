import React, { useState } from "react";
import '../pages/dhcp_configuration.css';

const TFTP = ()=>{
    const [data,setData] = useState([true,null]);
    return(
        <div className="dhcp_comp_container">
            <label>TFTP:</label>
            <button onClick={()=>{
                data[0]?(
                    setData([false,
                        <div className="dhcp_comp_internal_container">
                            <div className="dhcp_text">
                                <label>TFTP Server:</label>
                                <input type="text" placeholder="TFTP Server"></input>
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

export default TFTP;