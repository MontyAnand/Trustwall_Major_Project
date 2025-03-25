import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react";
import { useToast } from "../../Contexts/toastContext";
import { useDispatch, useSelector } from "react-redux";
import { createIPSet, getDescription, getIPsets, getShort, setDescription, setShort } from "../../Actions/firewall/ipset_actions";

export const IPseteditform = ({ visibleDialog }) => {

    const showToast = useToast();
    const dispatch = useDispatch();
    const { selectedIPSet, description, short, isLoading, error } = useSelector(state => state.ipset);

    const [ipsetName, setIPSetName] = useState(selectedIPSet);
    const [ipsetVersion, setIPSetVersion] = useState('');
    const [ipsetShort, setIPSetShort] = useState(short);
    const [ipsetDescription, setIPSetDescription] = useState(description);
    const [ipsetType, setIPSetType] = useState('hash:ip');
    const [ipsetFamily, setIPSetFamily] = useState('inet');
    const [ipsetTimeout, setIPSetTimeout] = useState('');
    const [ipsetHasSize, setIPSetHashSize] = useState('');
    const [ipsetMaxelem, setIPSetMaxelem] = useState('');

    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const types = [
        { type: 'hash:ip' },
        { type: 'hash:ip,port' },
        { type: 'hash:ip,mark' },
        { type: 'hash:ip,port,ip' },
        { type: 'hash:net' },
        { type: 'hash:net,net' },
        { type: 'hash:net,port,net' },
        { type: 'hash:net,port' },
        { type: 'hash:net,iface' },
        { type: 'hash:mac' },
    ]

    const families = [
        { family: 'inet' },
        { family: 'inet6' },
    ]

    const editIPSetOnClick = async () => {
        try {
            await dispatch(setDescription(ipsetName));
            if(error) throw new Error(error);
            await dispatch(setShort(ipsetName));
            if(error) throw new Error(error);
            await dispatch(getDescription(ipsetName));
            if(error) throw new Error(error);
            await dispatch(getShort(ipsetName));
            if(error) throw new Error(error);
            visibleDialog(false);
            showToast("success", "IPSet Saved", "IPSet details added successfully!");
        } catch(err) {

        }
    }

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="name">Name : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="name" value={ipsetName} onChange={ (e) => { 
                        setIPSetName(e.target.value);
                        setOkButtonDisabled(e.target.value === ''); 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="version">Version : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="version" value={ipsetVersion} onChange={ (e) => { 
                        setIPSetVersion(e.target.value) 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="short">Short : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="short" value={ipsetShort} onChange={ (e) => { 
                        setIPSetShort(e.target.value) 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="description">Description : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputTextarea id="description" value={ipsetDescription} onChange={ (e) => {
                        setIPSetDescription(e.target.value);
                    } }/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-item-center justify-content-end">
                    <label htmlFor="type">Type : </label>
                </div>
                <div style={{width: '60vw'}} className="align-items-center justify-content-start">
                    <Dropdown id="type" value={ipsetType} onChange={ (e) => {
                        setIPSetType(e.value);
                    } } options={types} optionLabel="type" placeholder="hash:ip" checkmark={true} highlightOnSelect={true}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-item-center justify-content-end">
                    <label htmlFor="family">Family : </label>
                </div>
                <div style={{width: '60vw'}} className="align-items-center justify-content-start">
                    <Dropdown id="family" value={ipsetFamily} onChange={ (e) => {
                        setIPSetFamily(e.value);
                    } } options={families} optionLabel="family" placeholder="inet" checkmark={true} highlightOnSelect={true}/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="timeout">Timeout : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText keyfilter={'int'} id="timeout" value={ipsetTimeout} onChange={ (e) => {
                        setIPSetTimeout(e.target.value);
                    } } placeholder="Timeout value in seconds"/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="hashsize">Hashsize : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText keyfilter={'int'} id="hashsize" value={ipsetHasSize} onChange={ (e) => {
                        setIPSetHashSize(e.target.value);
                    } } placeholder="Initial hashsize, default 1024"/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="maxelem">Maxelem : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText keyfilter={'int'} id="maxelem" value={ipsetMaxelem} onChange={ (e) => {
                        setIPSetMaxelem(e.target.value);
                    } } placeholder="Max number of elements, default 65535"/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={ () => {
                    visibleDialog(false);
                    showToast("warn", "Action Canceled", "No changes were made.");
                } }/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={editIPSetOnClick}/>
            </div>
        </ScrollPanel>
    );
}