import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";


export const Protocoleditform = ({ visibleDialog, edit, get, selectedItem, selectedProtocol }) => {

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone);

    const [protocol, setProtocol] = useState(selectedProtocol);
    const [otherProtocol, setOtherProtocol] = useState(selectedProtocol);
    const [otherProtocolChecked, setOtherProtocolChecked] = useState(false);

    const [protocolDisabled, setProtocolDisabled] = useState(false);
    const [otherProtocolDisabled, setOtherProtocolDisabled] = useState(true);
    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const protocols = [
        { protocol: '-select-'},
        { protocol: 'ah'},
        { protocol: 'esp'},
        { protocol: 'dccp'},
        { protocol: 'ddp'},
        { protocol: 'icmp'},
        { protocol: 'ipv6-icmp'},
        { protocol: 'igmp'},
        { protocol: 'mux'},
        { protocol: 'sctp'},
        { protocol: 'tcp'},
        { protocol: 'udp'},
    ];

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="protocol">Protocol : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <Dropdown id="protocol" value={protocol} onChange={ (e) => {
                        setProtocol(e.value);
                        setOkButtonDisabled(e.value === '-select-');
                    } } options={protocols} optionLabel="protocol" optionValue="protocol" placeholder="-select-" checkmark={true} highlightOnSelect={true} disabled={protocolDisabled}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end gap-3">
                    <Checkbox id="other_protocol" checked={otherProtocolChecked} onChange={ (e) => {
                        setOtherProtocolChecked(e.checked);
                        setProtocolDisabled(e.checked === true)
                        setOtherProtocolDisabled(e.checked !== true)
                    } }/>
                    <label htmlFor="other_protocol">Other Protocol : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="other_protocol" value={otherProtocol} onChange={ (e) => {
                        setOtherProtocol(e.target.value);
                        setOkButtonDisabled(e.target.value === '');
                    } } disabled={otherProtocolDisabled}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={() => visibleDialog(false)}/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={ async () => {
                    let Protocol = '';
                    if(otherProtocolChecked === true) Protocol = otherProtocol;
                    else Protocol = protocol;
                    try {
                        await dispatch(edit(selectedItem, Protocol));
                        if(error) throw new Error(error);
                        await dispatch(get(selectedItem));
                        if(error) throw new Error(error);
                    } catch (err) {
                        
                    }
                } }/>
            </div>
        </ScrollPanel>
    );
}