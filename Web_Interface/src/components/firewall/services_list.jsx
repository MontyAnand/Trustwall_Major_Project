import React, { useEffect, useState } from "react";
import { ListBox } from "primereact/listbox";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { deleteService, flushServiceData, getDescription, getPorts, getProtocols, getServices, getShort, getSourcePorts, setSelectedService } from "../../Actions/firewall/service_actions";
import { Serviceaddform } from "./servicesadd_form";
import { Serviceeditform } from "./servicesedit_form";

export const Serviceslist = () => {
    const [isDialogAddServiceVisible, setIsDialogAddServiceVisible] = useState(false);
    const [isDialogEditServiceVisible, setIsDialogEditServiceVisible] = useState(false);

    const dispatch = useDispatch();

    const { servicesList, selectedService, isLoading, error } = useSelector(state => state.ipset);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getServices());
                if(error) throw new Error(error);
            } catch(err) {

            }
        };
        fetchData();
    }, [dispatch]);

    const fetchZoneDataOnChange = async (e) => {
        const service = e.value;
        dispatch(flushServiceData);
        dispatch(setSelectedService(service));
        try {
            await dispatch(getDescription(service));
            if(error) throw new Error(error);
            await dispatch(getShort(service));
            if(error) throw new Error(error);
            await dispatch(getPorts(service));
            if(error) throw new Error(error);
            await dispatch(getProtocols(service));
            if(error) throw new Error(error);
            await dispatch(getSourcePorts(service));
            if(error) throw new Error(error);
        } catch (err) {
            
        }
    }

    const fetchZoneDataOnDoubleClick = async (e) => {
        const service = e.value;
        dispatch(flushServiceData);
        dispatch(setSelectedService(service));
        try {
            await dispatch(getDescription(service));
            if(error) throw new Error(error);
            await dispatch(getShort(service));
            if(error) throw new Error(error);
            await dispatch(getPorts(service));
            if(error) throw new Error(error);
            await dispatch(getProtocols(service));
            if(error) throw new Error(error);
            await dispatch(getSourcePorts(service));
            if(error) throw new Error(error);
        } catch (err) {
            
        }
    }

    return (
        <div className="card flex flex-column m-2">
            <ListBox 
                value={selectedService} 
                onChange={fetchZoneDataOnChange}
                onDoubleClick={fetchZoneDataOnDoubleClick}
                options={servicesList}
                optionLabel="service"
                optionValue="service"
                className="flex flex-column align-items-center justify-content-center w-full m-3" 
            />
            <div className="flex flex-column align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Add Service" className="p-button-danger gap-2" onClick={() => setIsDialogAddServiceVisible(true)}/>
                <Button icon='pi pi-check' label="Edit Service" className="p-button-success gap-2" onClick={() => setIsDialogEditServiceVisible(true)}/>
                <Button icon='pi pi-check' label="Delete Service" className="p-button-success gap-2" loading={isLoading} onClick={async () => {
                    try {
                        await dispatch(deleteService(selectedService));
                        if(error) throw new Error(error);
                        await dispatch(getServices());
                        if(error) throw new Error(error)
                    } catch (err) {

                    }
                }}/>
            </div>
            <Dialog
                header='ADD NEW SERVICE'
                visible={isDialogAddServiceVisible}
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddServiceVisible(false)}
                maximizable
            >
                <Serviceaddform visibleDialog={setIsDialogAddServiceVisible}/>
            </Dialog>
            <Dialog
                header='EDIT SERVICE'
                visible={isDialogEditServiceVisible}
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditServiceVisible(false)}
                maximizable
            >
                <Serviceeditform visibleDialog={setIsDialogEditServiceVisible}/>
            </Dialog>
        </div>
    );
};
