import { useState } from "react";
import React ,{useEffect} from "react";
import Sidebar from "../components/Sidebar";
import "./VPN.css"

function VPN(){
    const [loading,setLoding] = useState(true);
    const [ImageURL,changeImage] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAADFBMVEUAAAD///8NDQ0SEhLqUA48AAACiUlEQVR4nO3cy3biQAwFQAf+/5+zmklmsNVX7YYEKC37Id3yyifheLteztT2EdTWOXx8fa6u22U7VVHEzuHi+lRdCAkJCQkJO8K5qas8d2tI+PBAhO2GhA8PRNhuSPjwQA8RbsdVTC1Wkq2WsJOQkJCQkJCQcKWwhU+eAiEhISEhIeFTCJM+CZWQkJCQkJDwHsKkiqxJslbDZNbxLcI8fXKGkHAmIWGePjlDSDiTcN1vEx+wMlWEwyJcuTJVhMMiXLkyVe8gPFm/Xth8USiqaNiKsT7YskaEhOM+k8GWNSIkHPeZDLasEeGPCVtTW1lbTyGZNde5em8jJCQkJCQch38R4SrG8jOtleowISEhISEhYc8VXbtfjqTPzpnW/2YICQkJCd9U2KqnFLYCzSWbS59MTw6/vPBCSEhISEgYCJP7Bay1kmwl6QPYN+GtkZCQkJCQ8H/hbb2W8PTfEZJAc3WS+rVCSEhISEhI+LHTsRiW5DgZ8eSsnZXkK0qEhISEhO8ubDGeUhjpO8PmqtWneC47wQgJCQkJCQnLd5qTU5M+J59UNKt4L30JYfktaEJCQkLCUNg5/YzC5vtBUa0cc/jCU2wRxkU4YBAOGMUWYVyEAwbhgFFsFcGiOhmx6NMKXXmWfwv6dutHhXf42vXtFuF+H8IwBuGwCAmP+6wXFoGKiMXK3K1VD4iQkJCQkJDwX2NwqJOsiDjXZy7P1xYhISEhISHhOmHiSR5Hy1xMJyQkJCQkJLyHMPEkI1qMZOjLC8tf0BISEhISEh4Kk0pCF7dajKQPISEhISEhYSicq8Q8FzpIX8X4U4TDItyPSLg/gpBwrp5AeL2cqW+tg5VKGIw4Pnw79G9dPwGWL2OIZqPxGgAAAABJRU5ErkJggg==');
    return (
        <>
            <Sidebar/>
            <div className="outside_container"> 
                {loading?(
                    <div className="vpn_container">
                    <img className="vpn_img" src={ImageURL} alt="Search Icon"/>
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