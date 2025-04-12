import { Message } from 'primereact/message';
import VPN from './VPN';
import { VPNConfigurationForm } from './VPNConfigurationForm'

const Selectivelist = ({ name }) => {
    switch (name) {
        case 'VPN': return <VPN />;
        case 'Configuration': return <VPNConfigurationForm />;
        default: return null;
    }
};

export const Section = ({ msg, name }) => {
    return (
        <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
            <Message severity='info' text={msg} />
            <Selectivelist name={name} />
        </div>
    );
};