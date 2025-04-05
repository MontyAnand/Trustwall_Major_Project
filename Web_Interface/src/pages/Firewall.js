import { TabPanel, TabView } from "primereact/tabview";
import { Configuration } from "../components/firewall/configuration";
import Sidebar from "../components/Sidebar";

const Firewall = () => {
  return (
    <>
      <Sidebar />
      <div style={{ marginTop: '79px', padding: '0 20px', height: 'calc(100vh - 79px)', overflow: 'auto' }}>
        <TabView style={{ height: "100%", width: "100%" }}>
          <TabPanel header="NETWORK RULES">
            <Configuration
              msg={
                "A firewalld zones defines the level of trust for network connections, interfaces and source addresses bound to that zone.The zone combines services, ports, protocols, masquerading, port/packet forwarding, icmp filters and rich rules.The zone can be bound to interfaces and source addresses"
              }
              name={"IPRules"}
            />
          </TabPanel>
          <TabPanel header="FORWARD/REDIRECT">
            <Configuration
              msg={
                "A firewalld policies defines the level of trust for network connections, interfaces and source addresses bound to that zone.The zone combines services, ports, protocols, masquerading, port/packet forwarding, icmp filters and rich rules.The zone can be bound to interfaces and source addresses"
              }
              name={"FORWARD"}
            />
          </TabPanel>
          <TabPanel header="MAC RULES">
            <Configuration
              msg={
                "A firewald services is a combination of ports, protocols, modules and destination addresses"
              }
              name={"MACRules"}
            />
          </TabPanel>
          <TabPanel header="SETS">
            <Configuration
              msg={
                "An IPset is used to create white or black lists and is able to store for example IP addresses, port numbers or mac addresses"
              }
              name={"Sets"}
            />
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default Firewall;
