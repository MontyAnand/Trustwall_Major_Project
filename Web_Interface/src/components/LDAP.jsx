import React, { useState } from "react";
import '../pages/dhcp_configuration.css';

const LDAP = ()=>{
    const [data,setData] = useState([false,null]);
    const [ldapserverurl,setLDAPServerURL]=useState('');
    return(
        <div className="dhcp_comp_container">
            <label>LDAP:</label>
            <button onClick={()=>setData((prevContent)=>[!prevContent[0],null])}>
            <span>&#9965;</span> <span>{data[0]?'Hide':'Display'}</span> Advanced
            </button>
            {
                data[0] && 
                 <div className="dhcp_comp_internal_container">
                 <div className="dhcp_text">
                     <label>LDAP Server URI:</label>
                     <input type="text" placeholder="LDAP Server(e.g.,ldap://ldap.example.com/dc=example,dc=com)" value={ldapserverurl} onChange={(e)=>setLDAPServerURL(e.target.value)}></input>
                 </div>
             </div>
            }
        </div>
    );
};

export default LDAP;