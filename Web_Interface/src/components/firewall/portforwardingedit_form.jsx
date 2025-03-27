import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";

const validateIPv4 = (ip) => {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/;
    return ipv4Pattern.test(ip);
};

const validateIPv6 = (ip) => {
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$|^fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}$|^::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$|^([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$/;
    return ipv6Pattern.test(ip);
};

const validateIP = (ip) => {
    if(ip === '') return false;
    return validateIPv4(ip) || validateIPv6(ip);
};

const isValidPortVal = (portVal) => {
    const portNum = Number(portVal);
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

const isValidPort = (port) => {
    if(port === '') return false;
    return isValidPortVal(port) || isValidPortRange(port);
}

export const Portforwardingeditform = ({ visibleDialog, edit, get, selectedItem, selectedForwardPort }) => {

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone);

    const [protocol, setProtocol] = useState(selectedForwardPort.protocol);
    const [port, setPort] = useState(selectedForwardPort.port);
    const [localForwardingChecked, setLocalForwardingChecked] = useState(false);
    const [forwardToAnotherPortChecked, setForwardToAnotherPortChecked] = useState(false);
    const [toPort, setToPort] = useState(selectedForwardPort.toPort);
    const [toAddress, setToAddress] = useState(selectedForwardPort.toAddress);
    
    const [localForwardingDisabled, setLocalForwardingDisabled] = useState(false);
    const [forwardToAnotherPortDisabled, setForwardToAnotherPortDisabled] = useState(false);
    const [toAddressDisabled, setToAddressDisabled] = useState(false);
    const [toPortDisabled, setToPortDisabled] = useState(true);
    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const protocols = [
        { protocol: 'tcp' },
        { protocol: 'udp' },
        { protocol: 'sctp' },
        { protocol: 'dccp' },
    ];

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex align-items-center justify-content-start w-full gap-3 m-3">
                <h2>Source</h2>
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
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="port">Port/Port Range : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="port" value={port} onChange={ (e) => {
                        setPort(e.target.value);
                        setOkButtonDisabled(!isValidPort(e.target.value) || (!toAddressDisabled && !validateIP(toAddress)) || (!toPortDisabled && !isValidPort(toPort)));
                    } } placeholder="port[-port], port in range 0 to 65535"/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-start w-full gap-3 m-3">
                <h2>Destination</h2>
            </div>
            <div className="flex align-items-center justify-content-start w-full gap-3 m-3">
                <Checkbox checked={localForwardingChecked} onChange={ (e) => {
                    setLocalForwardingChecked(e.checked);
                    if (e.checked === true) {
                        setForwardToAnotherPortDisabled(true);
                        setToAddressDisabled(true);
                        setToPortDisabled(false);
                    }
                    else {
                        setForwardToAnotherPortDisabled(false);
                        setToAddressDisabled(false);
                        setToPortDisabled(true);
                    }
                } } disabled={localForwardingDisabled}/>
                Local Forwarding
            </div>
            <div className="flex align-items-center justify-content-start w-full gap-3 m-3">
                <Checkbox checked={forwardToAnotherPortChecked} onChange={ (e) => {
                    setForwardToAnotherPortChecked(e.checked);
                    if (e.checked === true) {
                        setLocalForwardingDisabled(true);
                        setToAddressDisabled(false);
                        setToPortDisabled(false);
                    }
                    else {
                        setLocalForwardingDisabled(false);
                        setToAddressDisabled(false);
                        setToPortDisabled(true);
                    }
                } } disabled={forwardToAnotherPortDisabled}/>
                Forward to anothet Port
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="toaddr">IP Address : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="toaddr" value={toAddress} onChange={ (e) => {
                        setToAddress(e.target.value);
                        setOkButtonDisabled(!isValidPort(port) || (!toAddressDisabled && !validateIP(e.target.value)) || (!toPortDisabled && !isValidPort(toPort)));
                    } } placeholder="(0-255).(0-255).(0-255).(0-255)" disabled={toAddressDisabled}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="toport">Port/Port Range : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="toport" value={toPort} onChange={ (e) => {
                        setToPort(e.target.value);
                        setOkButtonDisabled(!isValidPort(port) || (!toAddressDisabled && !validateIP(toAddress)) || (!toPortDisabled && !isValidPort(e.target.value)));
                    } } placeholder="port[-port], port in range 0 to 65535" disabled={toPortDisabled}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={() => visibleDialog(false)}/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={ async () => {
                    try {
                        await dispatch(edit(selectedItem, port, protocol, toPort, toAddress));
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