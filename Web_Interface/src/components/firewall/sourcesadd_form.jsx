import { Button } from "primereact/button";
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

const validateMAC = (mac) => {
    if(mac === '') return false;
    const macPattern = /^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$/;
    return macPattern.test(mac);
};

export const Sourceaddform = ({ visibleDialog, add, get, selectedItem }) => {

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone);

    const [sourceType, setSourceType] = useState('IP');
    const [source, setSource] = useState('');

    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const sourceTypes = [
        { sourceType: 'IP' },
        { sourceType: 'MAC' },
        { sourceType: 'IPSet' },
    ];

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <Dropdown value={sourceType} onChange={ (e) => {
                        setSourceType(e.value);
                        if(e.value === 'IP') setOkButtonDisabled(validateIP(source) === false);
                        else if(e.value === 'MAC') setOkButtonDisabled(validateMAC(source) === false); 
                        else setOkButtonDisabled(source === '');
                    } } options={sourceTypes} optionLabel="sourceType" optionValue="sourceType" placeholder="IP" checkmark={true} highlightOnSelect={true}/>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText value={source} onChange={ (e) => {
                        setSource(e.target.value);
                        if(sourceType === 'IP') setOkButtonDisabled(validateIP(e.target.value) === false);
                        else if(sourceType === 'MAC') setOkButtonDisabled(validateMAC(e.target.value) === false);
                        else setOkButtonDisabled(e.target.value === '');
                    } }/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={() => visibleDialog(false)}/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={ async () => {
                    let sourceVal = '';
                    if(sourceType === 'IP') sourceVal = source;
                    else if(sourceType === 'MAC') sourceVal = `MAC:${source}`;
                    else sourceVal = `ipset:${source}`;
                    try {
                        await dispatch(add(selectedItem, sourceVal))
                        if(error) throw new Error(error);
                        await dispatch(get(selectedItem));
                        if(error) throw new Error(error);
                    } catch(err) {

                    }
                } }/>
            </div>
        </ScrollPanel>
    );
}