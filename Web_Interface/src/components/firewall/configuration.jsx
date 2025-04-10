import { Message } from 'primereact/message';
import { ForwardRuleTable } from './forward_rules_table';
import { MACRuleTable } from './mac_rules_table';
import {IPRULETable} from './ip_rules_table';
import {SetList} from './set_list'

const Selectivelist = ({ name }) => {
    switch (name) {
        case 'FORWARD': return <ForwardRuleTable />;
        case 'MACRules': return <MACRuleTable />;
        case 'Sets': return <SetList />;
        case 'IPRules': return <IPRULETable />;
        default: return null;
    }
};


export const Configuration = ({ msg, name }) => {
    return (
        <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
            <Message severity='info' text={msg}  />
            <Selectivelist name={name} />
        </div>
    );
};
