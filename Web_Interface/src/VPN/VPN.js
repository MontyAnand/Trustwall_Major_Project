import { useEffect, useState, useRef } from "react";
import React from "react";
import { useSocket } from "../Contexts/socketContex";
import "./VPN.css";

function VPN() {
    const [imageURL, setImageURL] = useState('');
    const bufferRef = useRef(''); // buffer to accumulate data
    const { socket } = useSocket();

    const sendRequest = () => {
        if (!socket) {
            alert("Socket not connected");
            return;
        }

        setImageURL('');
        bufferRef.current = ''; // reset buffer

        socket.emit('newVPNConnection');

        setContent(
            <div className="vpn_container_3">
                <div className="loader"></div>
                <button className="qr_btn_3" disabled>
                    Generating...
                </button>
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


    const updateImageURL = (chunk) => {
        bufferRef.current += chunk;
    };

    const showQR = () => {
        const fullImage = bufferRef.current;
        setImageURL(fullImage);

        setContent(
            <div className="vpn_container_1">
                <img className="vpn_img" src={fullImage} alt="Generated QR Code" />
                <button className="qr_btn_1" onClick={sendRequest}>Generate QR Code</button>
            </div>
        );
    };

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
    }, [socket]);

    return (
        <div className="outside_container">
            {content}
        </div>
    );
}

export default VPN;