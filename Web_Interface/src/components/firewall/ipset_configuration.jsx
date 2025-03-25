import { ScrollPanel } from "primereact/scrollpanel";
import { TabPanel, TabView } from "primereact/tabview";
import { Entry } from "./entries";
import { useSelector } from "react-redux";
import { addEntry, getEntries, removeEntry } from "../../Actions/firewall/ipset_actions";

export const IPsetconfiguration = () => {

    const { selectedIPSet, entries, isLoading, error } = useSelector(state => state.ipset);

    return (
        <TabView style={{ height: '100%', width: '100%'}}>
            <TabPanel header='Entries'>
                <ScrollPanel style={{ height: '60vh', width: '100%'}}>
                    <Entry entries={entries} selectedItem={selectedIPSet} get={getEntries} add={addEntry} remove={removeEntry}/>
                </ScrollPanel>
            </TabPanel>
        </TabView>
    );
}