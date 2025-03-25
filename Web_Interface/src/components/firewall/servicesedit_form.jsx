import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react";
import { useToast } from "../../Contexts/toastContext";
import { useDispatch, useSelector } from "react-redux";
import { createService, getDescription, getServices, getShort, setDescription, setShort } from "../../Actions/firewall/service_actions";

export const Serviceeditform = ({ visibleDialog }) => {

    const showToast = useToast();
    const dispatch = useDispatch();
    const { selectedService, description, short, isLoading, error } = useSelector(state => state.service);

    const [serviceName, setServiceName] = useState(selectedService);
    const [serviceVersion, setServiceVersion] = useState('');
    const [serviceShort, setServiceShort] = useState(short);
    const [serviceDescription, setServiceDescription] = useState(description);

    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    const editServiceOnClick = async () => {
        try {
            await dispatch(setShort(serviceName, serviceShort));
            if(error) throw new Error(error);
            await dispatch(setDescription(serviceName, serviceDescription));
            if(error) throw new Error(error);
            await dispatch(getShort(serviceName));
            if(error) throw new Error(error);
            await dispatch(getDescription(serviceName));
            if(error) throw new Error(error);
            visibleDialog(false);
            showToast("success", "Service updated", "Service details updated successfully!");
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
                    <InputText id="name" value={serviceName} onChange={ (e) => { 
                        setServiceName(e.target.value);
                        setOkButtonDisabled(e.target.value === ''); 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="version">Version : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="version" value={serviceVersion} onChange={ (e) => { 
                        setServiceVersion(e.target.value) 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="short">Short : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="short" value={serviceShort} onChange={ (e) => { 
                        setServiceShort(e.target.value) 
                    } }/>
                </div>
            </div>
            <div className="flex justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="description">Description : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputTextarea id="description" value={serviceDescription} onChange={ (e) => {
                        setServiceDescription(e.target.value);
                    } }/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={ () => {
                    visibleDialog(false);
                    showToast("warn", "Action Canceled", "No changes were made.");
                } }/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={editServiceOnClick}/>
            </div>
        </ScrollPanel>
    );
}