import { TabPanel, TabView } from "primereact/tabview";
import { Section } from "./VPNComponent";
import Sidebar from "../components/Sidebar";

const VPN = () => {
    return (
        <>
            <Sidebar />
            <div style={{ marginTop: '79px', padding: '0 20px', height: 'calc(100vh - 79px)', overflow: 'auto' }}>
                <TabView style={{ height: "100%", width: "100%" }}>
                    <TabPanel header="VPN Tunnel">
                        <Section
                            msg={
                                "Click button to generate QR Code. Make sure you configured VPN Server.\n"
                            }
                            name={"VPN"}
                        />
                    </TabPanel>
                    <TabPanel header="VPN Server Configuration">
                        <Section
                            msg={
                                "Please fill IP and Netmask to configure VPN"
                            }
                            name={"Configuration"}
                        />
                    </TabPanel>
                </TabView>
            </div>
        </>
    );
}

export default VPN;