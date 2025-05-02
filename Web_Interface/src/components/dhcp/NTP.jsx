import React, { useState } from "react";
import '../pages/dhcp_configuration.css';



const NTP= ()=>{
    const [data,setData] = useState([false,null]);

    const [ntpserver1,setNTPServer1]=useState('');
    const [ntpserver2,setNTPServer2]=useState('');
    const [ntpserver3,setNTPServer3]=useState('');
    const [ntpserver4,setNTPServer4]=useState('');
    return(
        <div className="dhcp_comp_container">
            <label>NTP:</label>
            <button onClick={()=>setData((prevContent)=>[!prevContent[0],null])}>
            <span>&#9965;</span> <span>{data[0]?'Hide':'Display'}</span> Advanced
            </button>
            {
                data[0] && 
                    <div className="dhcp_comp_internal_container">
                        <div className="dhcp_text">
                            <label>NTP Server 1:</label>
                            <input type="text" placeholder="NTP Server 1" value={ntpserver1} onChange={(e)=>setNTPServer1(e.target.value)}></input>
                        </div>
                        <div className="dhcp_text">
                            <label>NTP Server 2:</label>
                            <input type="text" placeholder="NTP Server 2" value={ntpserver2} onChange={(e)=>setNTPServer2(e.target.value)}></input>
                        </div>
                        <div className="dhcp_text">
                            <label>NTP Server 3:</label>
                            <input type="text" placeholder="NTP Server 3" value={ntpserver3} onChange={(e)=>setNTPServer3(e.target.value)}></input>
                        </div>
                        <div className="dhcp_text">
                            <label>NTP Server 4:</label>
                            <input type="text" placeholder="NTP Server 4" value={ntpserver4} onChange={(e)=>setNTPServer4(e.target.value)}></input>
                        </div>
                    </div>
            }
        </div>
    );
};

export default NTP;