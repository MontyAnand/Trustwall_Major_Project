import React ,{useState} from "react";
import "./dhcp_configuration.css"

function DHCPConfiguration(){
    const [content1,setContent1] = useState([false,null]);
    const [content2,setContent2] = useState([false,null]);
    const [content3,setContent3] = useState([false,null]);
    const [content4,setContent4] = useState([false,null]);
    return (
        <div className="dhcp_container">
            <h1>DHCPv4 Configuration Server</h1>
            {/* General setting */}
            <h2 onClick={()=>
                setContent1(prevContent =>[
                    !prevContent[0],
                    <div className="dhcp_internal_container">
                        <form className="dhcp_general_container">
                            <div className="dhcp_checkbox">
                                <label name="Interface_Name">Enable DHCPv4 Server</label>
                                <input type="checkbox" for="Interface_Name"></input>
                            </div>
                            <br></br>
                            <div className="dhcp_select">
                                <label>Interface:</label>
                                <select name="Interfaces">
                                    <option>--Select--</option>
                                    <option value="LAN">LAN</option>
                                    <option value="WAN">WAN</option>
                                </select>
                            </div>
                            <br></br>
                            <div className="dhcp_text">
                                <label>Subnet:</label>
                                <input type="text" placeholder="192.168.1.0"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>Subnet Mask:</label>
                                <input type="text" placeholder="255.255.255.0"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>Range Start:</label>
                                <input type="text" placeholder="e.g.,192.168.1.100"></input>
                            </div>
                            <div className="dhcp_text">
                                <label>Range End:</label>
                                <input type="text" placeholder="e.g.,192.168.1.200"></input>
                            </div>
                        </form>
                    </div>
                ])
            }>General Setting</h2>
            {content1[0] ? (
                <>{content1[1]}</>
            ) : (
                <></>
            )}
            {/* Lease setting */}
            <h2 onClick={()=>
                setContent2(prevContent =>[
                    !prevContent[0],
                    <div className="dhcp_internal_container">
                        <div className="dhcp_lease_container">
                            <div className="dhcp_number">
                                <label for="defaultLeaseTime">Default Lease Time (seconds):</label>
                                <input type="number" id="defaultLeaseTime" name="defaultLeaseTime" placeholder="e.g.,3600" required />
                            </div>
                            <div className="dhcp_number">
                                <label for="maxLeaseTime">Maximum Lease Time (seconds):</label>
                                <input type="number" id="maxLeaseTime" name="maxLeaseTime" placeholder="e.g.,86400" required />
                            </div>
                        </div>
                    </div>
                ])
            }>Lease Setting</h2>
            {content2[0] ? (
                <>{content2[1]}</>
            ) : (
                <></>
            )}
            {/* DNS and gateway setting */}
            <h2 onClick={()=>
                setContent3(prevContent =>[
                    !prevContent[0],
                    <div className="dhcp_internal_container">
                        <div className="dhcp_DNS_container">
                            <div className="dhcp_text">
                                <label for="dnsServer1">DNS Server 1:</label>
                                <input type="text" id="dnsServer1" name="dnsServer1" placeholder="8.8.8.8" required />
                            </div>

                            <div className="dhcp_text">
                                <label for="dnsServer2">DNS Server 2:</label>
                                <input type="text" id="dnsServer2" name="dnsServer2" placeholder="8.8.4.4" required />
                            </div>

                            <div className="dhcp_text"> 
                                <label for="defaultGateway">Default Gateway:</label>
                                <input type="text" id="defaultGateway" name="defaultGateway" placeholder="192.168.1.1" required />
                            </div>
                        </div>
                    </div>
                ])
            }>DNS and Gateway Setting</h2>
            {content3[0] ? (
                <>{content3[1]}</>
            ) : (
                <></>
            )}

            {/* Advanced Setting */}
            <h2 onClick={()=>
                setContent4(prevContent =>[
                    !prevContent[0],
                    <div className="dhcp_internal_container">
                        <div className="dhcp_advanced_container">
                            <div className="dhcp_text">
                                <label for="ntpServer">NTP Server:</label>
                                <input type="text" id="ntpServer" name="ntpServer" placeholder="time.google.com" required />
                            </div>

                            <div className="dhcp_text">
                                <label for="domainName">Domain Name:</label>
                                <input type="text" id="domainName" name="domainName" placeholder="trustwall.org" required />
                            </div>
                        </div>
                    </div>
                ])
            }>Advanced Setting</h2>
            {content4[0] ? (
                <>{content4[1]}</>
            ) : (
                <></>
            )}
            <div className="dhcp_btn_container">
                <button type="submit" className="dhcp_save_btn" >Save Configuration</button>
            </div>
        </div>
    );
};

export default DHCPConfiguration;  
