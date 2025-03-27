import React, { useState } from "react";
import '../pages/dhcp_configuration.css';
const MACAddressControl = () => {
    const [data, setData] = useState([false, null]);

    const [macallow, setMacAllow] = useState('');
    const [macdeny, setMacDeny] = useState('');
   
    return (
        <div className="dhcp_comp_container">
            <label>MAC Address Control:</label>
            <button onClick={() => setData((prevContent) => [!prevContent[0], null])}>
                <span>&#9965;</span> <span>{data[0] ? 'Hide' : 'Display'}</span> Advanced
            </button>
            {
                data[0] &&
                <div className="dhcp_comp_internal_container">
                    <div className="dhcp_text">
                        <label>MAC Allow:</label>
                        <input type="text" placeholder="00:11:22:33:44:55" value={macallow} onChange={(e) => {
                            setMacAllow(e.target.value)

                        }}></input>
                    </div>

                    <div className="dhcp_text">
                        <label>MAC Deny:</label>
                        <input type="text" placeholder="00:11:22:33:44:55" value={macdeny} onChange={(e) => {
                            setMacDeny(e.target.value)

                        }}></input>
                    </div>

                </div>
            }
        </div>
    );
};

export default MACAddressControl;