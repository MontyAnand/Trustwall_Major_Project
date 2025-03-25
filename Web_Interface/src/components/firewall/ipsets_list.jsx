import React, { useEffect, useState } from "react";
import { ListBox } from "primereact/listbox";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { deleteIPSet, flushIPSetData, getDescription, getEntries, getIPsets, getIPSetTypes, getShort, setSelectedIPSet } from "../../Actions/firewall/ipset_actions";
import { IPsetaddform } from "./ipsetsadd_form";
import { IPseteditform } from "./ipsetsedit_form";

export const IPSetslist = () => {
    const [isDialogAddIPSetVisible, setIsDialogAddIPSetVisible] = useState(false);
    const [isDialogEditIPSetVisible, setIsDialogEditIPSetVisible] = useState(false);

    const dispatch = useDispatch();

    const { ipsetsList, ipsetTypesList, selectedIPSet, isLoading, error } = useSelector(state => state.service);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getIPsets());
                if(error) throw new Error(error);
                await dispatch(getIPSetTypes());
                if(error) throw new Error(error);
            } catch(err) {

            }
        };
        fetchData();
    }, [dispatch]);

    const fetchZoneDataOnChange = async (e) => {
        const IPSet = e.value;
        dispatch(flushIPSetData);
        dispatch(setSelectedIPSet(IPSet));
        try {
            await dispatch(getDescription(IPSet));
            if(error) throw new Error(error);
            await dispatch(getShort(IPSet));
            if(error) throw new Error(error);
            await dispatch(getEntries(IPSet));
            if(error) throw new Error(error);
        } catch (err) {
            
        }
    }

    const fetchZoneDataOnDoubleClick = async (e) => {
        const IPSet = e.value;
        dispatch(flushIPSetData);
        dispatch(setSelectedIPSet(IPSet));
        try {
            await dispatch(getDescription(IPSet));
            if(error) throw new Error(error);
            await dispatch(getShort(IPSet));
            if(error) throw new Error(error);
            await dispatch(getEntries(IPSet));
            if(error) throw new Error(error);
        } catch (err) {
            
        }
    }

    return (
        <div className="card flex flex-column m-2">
            <ListBox 
                value={selectedIPSet} 
                onChange={fetchZoneDataOnChange}
                onDoubleClick={fetchZoneDataOnDoubleClick}
                options={ipsetsList}
                optionLabel="ipset"
                optionValue="ipset"
                className="flex flex-column align-items-center justify-content-center w-full m-3" 
            />
            <div className="flex flex-column align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Add IPSet" className="p-button-danger gap-2" onClick={() => setIsDialogAddIPSetVisible(true)}/>
                <Button icon='pi pi-check' label="Edit IPSet" className="p-button-success gap-2" onClick={() => setIsDialogEditIPSetVisible(true)}/>
                <Button icon='pi pi-check' label="Delete IPSet" className="p-button-success gap-2" loading={isLoading} onClick={async () => {
                    try {
                        await dispatch(deleteIPSet(selectedIPSet));
                        if(error) throw new Error(error);
                        await dispatch(getIPsets());
                        if(error) throw new Error(error)
                    } catch (err) {

                    }
                }}/>
            </div>
            <Dialog
                header='ADD NEW SERVICE'
                visible={isDialogAddIPSetVisible}
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddIPSetVisible(false)}
                maximizable
            >
                <IPsetaddform visibleDialog={setIsDialogAddIPSetVisible}/>
            </Dialog>
            <Dialog
                header='EDIT SERVICE'
                visible={isDialogEditIPSetVisible}
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditIPSetVisible(false)}
                maximizable
            >
                <IPseteditform visibleDialog={setIsDialogEditIPSetVisible}/>
            </Dialog>
        </div>
    );
};
