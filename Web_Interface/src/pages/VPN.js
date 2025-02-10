import { useState } from "react";
import React ,{useEffect} from "react";
import Sidebar from "../components/Sidebar";
import "./VPN.css"

function VPN(){
    const [loading,setLoding] = useState(true);
    const [ImageBasecode,changeImage] = useState('');
    return (
        <>
            <Sidebar/>
            <div className="outside_container"> 
                {loading?(
                    <div className="vpn_container">
                    <img className="vpn_img" src={ImageBasecode} alt="Search Icon"/>
                    <button className="qr_btn">Generate QR Code</button>
                    </div>
                )
                :
                (
                    <div className="vpn_containers">
                    <div className="initial"><p>Press the "Button" to generate unique QR code</p></div>
                    <button className="qr_btn">Generate QR Code</button>
                    </div>
                )
                }
            </div>
        </>
    );
}

export default VPN;