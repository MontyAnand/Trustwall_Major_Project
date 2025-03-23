import React from "react";
import '../pages/dhcp_configuration.css'

const InternalCustomDHCP = (props) =>{
    return (
            <div id ={props.count} className="internal_custom_dhcp_container">
                <div className="dhcp_number">
                <label>Number:</label>
                <input type="number"></input>
                </div>
                <div className="dhcp_select">
                <label>Type:</label>
                <select>
                    <option value="0">Text</option>
                    <option value="1">String</option>
                    <option value="2">Boolean</option>
                    <option value="3">Unsigned 8-bit integer</option>
                    <option value="4">Unsigned 16-bit integer</option>
                    <option value="5">Unsigned 32-bit integer</option>
                    <option value="6">Signed 8-bit integer</option>
                    <option value="7">Signed 16-bit integer</option>
                    <option value="8">Signed 32-bit integer</option>
                    <option value="9">IP address or host</option>
                </select>
                </div>
                <div className="dhcp_text">
                <label>Value:</label>
                <input type="text"></input>
                </div>
                <div className="dhcp_delete_btn">
                    <button style={{"backgroundColor":'#208237'}} onClick={()=>document.getElementById(props.count).remove()}>Delete</button>
                </div>
            </div>
    );
};

export default InternalCustomDHCP;