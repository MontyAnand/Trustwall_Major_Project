import React, { useState } from "react";
import '../pages/dhcp_configuration.css';

const TFTP = ()=>{
    const [data,setData] = useState([false,null]);
    const [tftpserver,setTFTPServer]=useState('');
    return(
        <div className="dhcp_comp_container">
            <label>TFTP:</label>
            <button onClick={()=>setData((prevContent)=>[!prevContent[0],null])}>
            <span>&#9965;</span> <span>{data[0]?'Hide':'Display'}</span> Advanced
            </button>
            {
                data[0] &&
                  <div className="dhcp_comp_internal_container">
                  <div className="dhcp_text">
                      <label>TFTP Server:</label>
                      <input type="text" placeholder="TFTP Server" value={tftpserver} onChange={(e)=>setTFTPServer(e.target.value)}></input>
                  </div>
              </div>
            }
        </div>
    );
};

export default TFTP;