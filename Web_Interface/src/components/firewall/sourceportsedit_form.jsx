import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";

const isValidPort = (port) => {
    const portNum = Number(port);
    return Number.isInteger(portNum) && portNum >= 0 && portNum <= 65535;
}

const isValidPortRange = (portRange) => {
    const regex = /^(\d+)-(\d+)$/;
    const match = portRange.match(regex);
    if (!match) return false;
    const startPort = parseInt(match[1], 10);
    const endPort = parseInt(match[2], 10);
    return isValidPort(startPort) && isValidPort(endPort) && startPort < endPort;
}

export const Sourceporteditform = ({ visibleDialog, edit, get, selectedItem, selectedSourcePort }) => {

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone);

    const [port, setPort] = useState(selectedSourcePort.port);
    const [protocol, setProtocol] = useState(selectedSourcePort.protocol);

    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const protocols = [
        { protocol: 'tcp' },
        { protocol: 'udp' },
        { protocol: 'sctp' },
        { protocol: 'dccp' },
    ];

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="port">Port/Port Range : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="port" value={port} onChange={ (e) => {
                        setPort(e.target.value);
                        const portVal = e.target.value;
                        setOkButtonDisabled(!(portVal !== '' && (isValidPort(portVal) || isValidPortRange(portVal))))
                    } } placeholder="port[-port], port in range 0 to 65535"/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="protocol">Protocol : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <Dropdown id="protocol" value={protocol} onChange={ (e) => {
                        setProtocol(e.value);
                    } } options={protocols} optionLabel="protocol" placeholder="tcp" checkmark={true} highlightOnSelect={true}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={() => visibleDialog(false)}/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={ async () => {
                    try {
                        await dispatch(edit(selectedItem, port, protocol));
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