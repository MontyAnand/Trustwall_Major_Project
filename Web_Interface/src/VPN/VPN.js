import { useEffect, useState } from "react";
import React from "react";
import { useSocket } from "../Contexts/socketContex";
import "./VPN.css"

function VPN() {
    const [imageURL, setImageURL] = useState('');
    const { socket, socketID } = useSocket();

    const sendRequest = () => {
        if (!socket) {
            alert("Socket not connected");
            return;
        }
        setImageURL('');
        socket.emit('newVPNConnection');
        setContent(
            <div className="vpn_container_3">
                <div className="loader"></div>
                <button className="qr_btn_3">Generate QR Code</button>
            </div>
        );
    }

    const updateImageURL = (newData) => {
        setImageURL((prevState) => prevState + newData); // Ensure state updates correctly
    };

    const showQR = () => {
        setContent(
            <div className="vpn_container_1">
                <img className="vpn_img" src={imageURL} alt="Generated QR Code" />
                <button className="qr_btn_1">Generate QR Code</button>
            </div>
        );
    };

    const [content, setContent] = useState(
        <div className="vpn_container_2">
            <button className="qr_btn_2" onClick={sendRequest}>
                Generate QR Code
            </button>
        </div>
    );

    useEffect(() => {
        if (!socket) return;

        socket.on('vpn-data', updateImageURL);
        socket.on('vpn-data-completed', showQR);

        socket.on('vpn-connection-error', () => {
            setContent(<p>Error establishing VPN connection</p>);
        });

        return () => {
            socket.off('vpn-data', updateImageURL);
            socket.off('vpn-data-completed', showQR);
            socket.off('vpn-connection-error');
        };
    }, [socket, imageURL, content]); // Added imageURL as dependency to always get the latest value

    return (
        <>
            <div className="outside_container">
                {content}
            </div>
        </>
    );
}

export default VPN;
