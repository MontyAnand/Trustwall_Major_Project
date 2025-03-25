import { Message } from 'primereact/message';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Zoneslist } from './zones_list';
import { Policieslist } from './policies_list';
import { Serviceslist } from './services_list';
import { Zoneconfiguration } from './zone_configuration';
import { Policyconfiguration } from './policy_configuration';
import { Serviceconfiguration } from './service_configuration';
import { IPsetconfiguration } from './ipset_configuration';
import { IPSetslist } from './ipsets_list';

const Selectivelist = ({ name }) => {
    switch (name) {
        case 'Zones': return <Zoneslist />;
        case 'Policies': return <Policieslist />;
        case 'Services': return <Serviceslist />;
        case 'IPsets': return <IPSetslist />;
        default: return null;
    }
};

const Selectiveconfiguratiion = ({ name }) => {
    switch (name) {
        case 'Zones': return <Zoneconfiguration />;
        case 'Policies': return <Policyconfiguration />;
        case 'Services': return <Serviceconfiguration />;
        case 'IPsets': return <IPsetconfiguration />;
        default: return null;
    }
};

export const Configuration = ({ msg, name }) => {
    return (
        <div style={{height: '65vh', width: '85vw'}}>
            <Message severity='info' text={msg} className='gap-3'/>
            <Splitter style={{ height: '100%', width: '100%'}}>
                <SplitterPanel size={10} minSize={5} style={{overflow: 'hidden'}}>
                    <ScrollPanel style={{ height: '100%', width: '100%' }}>
                        <Selectivelist name={name}/>
                    </ScrollPanel>
                </SplitterPanel>
                <SplitterPanel size={90} minSize={80} style={{overflow: 'hidden'}}>
                    <Selectiveconfiguratiion name={name}/>
                </SplitterPanel>
            </Splitter>
        </div>
    );
}