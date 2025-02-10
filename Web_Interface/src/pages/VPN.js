import { useEffect, useState } from "react";
import React from "react";
import Sidebar from "../components/Sidebar";
import {useSocket} from "../Contexts/socketContex";
import "./VPN.css"

function VPN(){
    const [ImageURL,changeImage] = useState('');
    const {socket , socketID} = useSocket();
    const [content, setContent] = useState(
        <div className="vpn_container_2">
            <button className="qr_btn_2" onClick={() => {
            if(socket){
                socket.emit("newVPNConnection");
                console.log("socket")
                setContent(
                    <div className="vpn_container_3">
                        <div className="loader"></div>
                        <button className="qr_btn_3">Generate QR Code</button>
                    </div>
                );}
            }}>
                Generate QR Code
            </button>
        </div>
    );

    useEffect(()=>{
        if(!socket) return;

        socket.on('vpn-data', (data)=>{
            changeImage (ImageURL => ImageURL+data);
        });

        socket.on('vpn-data-completed', ()=>{
            setContent(
                <div className="vpn_container_1">
                    <img className="vpn_img" src={ImageURL} alt="Search Icon"/>
                    <button className="qr_btn_1">Generate QR Code</button>
                </div>
            );
        });
        // Error Handling 
        socket.on('vpn-connection-error',()=>{
            setContent();
        });

        return ()=>{
            socket.off('vpn-data');
            socket.off('vpn-data-completed');
            socket.off('vpn-connection-error')
          }
    },[socket]);
    return (
        <>
            <Sidebar/>
            <div className="outside_container"> 
                {content}
                {/* <div className="vpn_container_1"> */}
                {/* <img className="vpn_img" src={ImageURL} alt="Search Icon"/> */}
                {/* <button className="qr_btn_1">Generate QR Code</button> */}
                {/* </div> */} 
                {/* // /*
                // :
                // (
                //     <div className="vpn_container_2">
                //     <button className="qr_btn_2">Generate QR Code</button>
                //     </div>
                // )
                // } */ }
            </div>
        </>
    );
}

export default VPN;