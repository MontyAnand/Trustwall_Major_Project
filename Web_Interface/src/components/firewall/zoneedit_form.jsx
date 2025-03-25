import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from '../../Contexts/toastContext'
import { getDescription, getShort, getTarget, setDescription, setShort, setTarget } from "../../Actions/firewall/zone_actions";

export const Zoneeditform = ({ visibleDialog }) => {

    const showToast = useToast();
    const dispatch = useDispatch();
    const { selectedZone, target, description, short, isLoading, error } = useSelector(state => state.zone);

    let targetChecked = true;
    if(target === 'default') targetChecked = true;
    else targetChecked = false;

    const [zoneName, setZoneName] = useState(selectedZone);
    const [zoneVersion, setZoneVersion] = useState('');
    const [zoneShort, setZoneShort] = useState(short);
    const [zoneDescription, setZoneDescription] = useState(description);
    const [zoneTargetChecked, setZoneTargetChecked] = useState(targetChecked);
    const [zoneTarget, setZoneTarget] = useState(target);

    const [zoneTargetDisabled, setZoneTargetDisabled] = useState(true);
    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const targets = [
        { target: 'accept' },
        { target: 'reject' },
        { target: 'drop' },
    ];

    const editZoneOnClick = async () => {
        try {
            await dispatch(setShort(selectedZone, zoneShort));
            if(error) throw new Error(error);
            await dispatch(setDescription(selectedZone, zoneDescription));
            if(error) throw new Error(error);
            await dispatch(setTarget(selectedZone, zoneTarget));
            if(error) throw new Error(error);
            await dispatch(getShort(selectedZone));
            if(error) throw new Error(error);
            await dispatch(getDescription(selectedZone));
            if(error) throw new Error(error);
            await dispatch(getTarget(selectedZone));
            if(error) throw new Error(error);
            visibleDialog(false);
            showToast("success", "Zone updated", "Zone details updated successfully!");
        } catch (err) {

        }
    }

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="name">Name : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="name" value={zoneName} onChange={ (e) => { 
                        setZoneName(e.target.value);
                        setOkButtonDisabled(e.target.value === ''); 
                    } } disabled={true}/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="version">Version : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="version" value={zoneVersion} onChange={ (e) => { 
                        setZoneVersion(e.target.value) 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="short">Short : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="short" value={zoneShort} onChange={ (e) => { 
                        setZoneShort(e.target.value) 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="description">Description : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputTextarea id="description" value={zoneDescription} onChange={ (e) => {
                        setZoneDescription(e.target.value);
                    } }/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="target">Target : </label>
                </div>
                <div style={{width: '60vw'}} className="fex flex-column align-items-center justify-content-start">
                    <div className="flex m-3">
                        <Checkbox id="target" className="mr-3" checked={zoneTargetChecked} onChange={ (e) => {
                            setZoneTargetChecked(e.checked);
                            if(e.checked === false) setZoneTargetDisabled(false);
                            else {
                                setZoneTargetDisabled(true);
                                setZoneTarget('default');
                            }
                        } }/>
                        default target
                    </div>
                    <div className="m-3">
                        <Dropdown value={zoneTarget} onChange={ (e) => {
                            setZoneTarget(e.value)
                        }} options={targets} optionLabel="target" placeholder="default" checkmark={true} highlightOnSelect={true} disabled={zoneTargetDisabled}/>
                    </div>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={() => {
                    visibleDialog(false);
                    showToast("warn", "Action Canceled", "No changes were made.");
                }}/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" disabled={okButtonDisabled} loading={isLoading} onClick={editZoneOnClick}/>
            </div>
        </ScrollPanel>
    );
}