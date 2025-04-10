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
                "This section allows to add custom rules with different combinations of IP and PORT and Protocols with Network traffic control. By default UTM blocks all network traffic. Please make sure you selected Input and Output Interfaces\n"
              }
              name={"IPRules"}
            />
          </TabPanel>
          <TabPanel header="FORWARD/REDIRECT">
            <Configuration
              msg={
                "This section allows to add rule for forwading the request to a specific IP and PORT. Please keep in mind, If particular IP or PORT is blocked request will not be forwarded."
              }
              name={"FORWARD"}
            />
          </TabPanel>
          <TabPanel header="MAC RULES">
            <Configuration
              msg={
                "This section allows to accept/block any network traffic based on source MAC. Note that MAC rules have higher priority than IP rules."
              }
              name={"MACRules"}
            />
          </TabPanel>
          <TabPanel header="SETS">
            <Configuration
              msg={
                "A Set is used to store elements of similar type. For example IP addresses, port numbers or mac addresses"
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
