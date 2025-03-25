import React, { useEffect, useState } from "react";
import { ListBox } from "primereact/listbox";
import { useDispatch, useSelector } from "react-redux";
import { deleteZone, flushZoneData, getActiveZones, getDefaultZone, getDescription, getICMPTypesList, getServicesList, getShort, getTarget, getZones, listForwardPorts, listICMPBlocks, listInterfaces, listPorts, listProtocols, listServices, listSourcePorts, listSources, queryForward, queryICMPBlockInversion, queryMasquerade, setSelectedZone } from "../../Actions/firewall/zone_actions";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Zoneaddform } from "./zoneadd_form";
import { Zoneeditform } from "./zoneedit_form";

export const Zoneslist = () => {
    const [isDialogAddZoneVisible, setIsDialogAddZoneVisible] = useState(false);
    const [isDialogEditZoneVisible, setIsDialogEditZoneVisible] = useState(false);

    const dispatch = useDispatch();

    const { zonesList, defaultZone, activeZones, selectedZone, isLoading, error } = useSelector(state => state.zone);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getZones());
                if(error) throw new Error(error);
                await dispatch(getDefaultZone());
                if(error) throw new Error(error);
                await dispatch(getActiveZones());
                if(error) throw new Error(error);
                await dispatch(getServicesList());
                if(error) throw new Error(error);
                await dispatch(getICMPTypesList());
                if(error) throw new Error(error);
            } catch(err) {
                // showError(err.message);
            }
        };
        fetchData();
    }, [dispatch]);

    const fetchZoneDataOnChange = async (e) => {
        const zone = e.value;
        dispatch(flushZoneData());
        dispatch(setSelectedZone(zone));
        try {
            await dispatch(getTarget(zone));
            if(error) throw new Error(error);
            await dispatch(getDescription(zone));
            if(error) throw new Error(error);
            await dispatch(getShort(zone));
            if(error) throw new Error(error);
            await dispatch(queryICMPBlockInversion(zone));
            if(error) throw new Error(error);
            await dispatch(queryForward(zone));
            if(error) throw new Error(error);
            await dispatch(listInterfaces(zone));
            if(error) throw new Error(error);
            await dispatch(listSources(zone));
            if(error) throw new Error(error);
            await dispatch(listServices(zone));
            if(error) throw new Error(error);
            await dispatch(listPorts(zone));
            if(error) throw new Error(error);
            await dispatch(listProtocols(zone));
            if(error) throw new Error(error);
            await dispatch(listSourcePorts(zone));
            if(error) throw new Error(error);
            await dispatch(listICMPBlocks(zone));
            if(error) throw new Error(error);
            await dispatch(listForwardPorts(zone));
            if(error) throw new Error(error);
            await dispatch(queryMasquerade(zone));
            if(error) throw new Error(error);
        } catch (err) {
            
        }
    }

    const fetchZoneDataOnDoubleClick = async (e) => {
        const zone = e.value;
        dispatch(flushZoneData());
        dispatch(setSelectedZone(zone));
        try {
            await dispatch(getTarget(zone));
            if(error) throw new Error(error);
            await dispatch(getDescription(zone));
            if(error) throw new Error(error);
            await dispatch(getShort(zone));
            if(error) throw new Error(error);
            await dispatch(queryICMPBlockInversion(zone));
            if(error) throw new Error(error);
            await dispatch(queryForward(zone));
            if(error) throw new Error(error);
            await dispatch(listInterfaces(zone));
            if(error) throw new Error(error);
            await dispatch(listSources(zone));
            if(error) throw new Error(error);
            await dispatch(listServices(zone));
            if(error) throw new Error(error);
            await dispatch(listPorts(zone));
            if(error) throw new Error(error);
            await dispatch(listProtocols(zone));
            if(error) throw new Error(error);
            await dispatch(listSourcePorts(zone));
            if(error) throw new Error(error);
            await dispatch(listICMPBlocks(zone));
            if(error) throw new Error(error);
            await dispatch(listForwardPorts(zone));
            if(error) throw new Error(error);
            await dispatch(queryMasquerade(zone));
            if(error) throw new Error(error);
        } catch (err) {
            
        }
    }

    return (
        <div className="card flex flex-column m-2">
            <ListBox 
                value={selectedZone} 
                onChange={fetchZoneDataOnChange}
                onDoubleClick={fetchZoneDataOnDoubleClick}
                options={zonesList}
                optionLabel="zone"
                optionValue="zone"
                className="flex flex-column align-items-center justify-content-center w-full m-3" 
            />
            <div className="flex flex-column align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Add Zone" className="p-button-danger gap-2" onClick={() => setIsDialogAddZoneVisible(true)}/>
                <Button icon='pi pi-check' label="Edit Zone" className="p-button-success gap-2" onClick={() => setIsDialogEditZoneVisible(true)}/>
                <Button icon='pi pi-check' label="Delete Zone" className="p-button-success gap-2" loading={isLoading} onClick={async () => {
                    try {
                        await dispatch(deleteZone(selectedZone));
                        if(error) throw new Error(error);
                        await dispatch(getZones());
                        if(error) throw new Error(error)
                    } catch (err) {

                    }
                }}/>
            </div>
            <Dialog
                header='ADD NEW ZONE'
                visible={isDialogAddZoneVisible}
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddZoneVisible(false)}
                maximizable
            >
                <Zoneaddform visibleDialog={setIsDialogAddZoneVisible}/>
            </Dialog>
            <Dialog
                header='EDIT ZONE'
                visible={isDialogEditZoneVisible}
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditZoneVisible(false)}
                maximizable
            >
                <Zoneeditform visibleDialog={setIsDialogEditZoneVisible}/>
            </Dialog>
        </div>
    );
};
