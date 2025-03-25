import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Portforwardingaddform } from "./portforwardingadd_form";
import { Portforwardingeditform } from "./portforwardingedit_form";

export const Portforwarding = ({ forwardPorts, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone); 

    const [isDialogAddForwardPortVisible, setIsDialogAddForwardPortVisible] = useState(false);
    const [isDialogEditForwardPortVisible, setIsDialogEditForwardPortVisible] = useState(false);
    const [selectedForwardPort, setSelectedForwardPort] = useState(null);

    const actionEdit = (selectedForwardPort) => {
        setSelectedForwardPort(selectedForwardPort);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditForwardPortVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedForwardPort) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                try {
                    await dispatch(remove(selectedItem, selectedForwardPort.port, selectedForwardPort.protocol, selectedForwardPort.toPort, selectedForwardPort.toAddress));
                    if(error) throw new Error(error);
                    await dispatch(get(selectedItem));
                    if(error) throw new Error(error);
                } catch (err) {

                }
            } }/>
        </div>
    );

    return (
        <div className="card">
            <div style={{ maxHeight: "40vh", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
                <DataTable value={forwardPorts}>
                    <Column field="port" header="Port"></Column>
                    <Column field="protocol" header="Protocol"></Column>
                    <Column field="toPort" header="To Port"></Column>
                    <Column field="toAddress" header="To Address"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddForwardPortVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddForwardPortVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddForwardPortVisible(false)}
                maximizable
            >
                <Portforwardingaddform visibleDialog={setIsDialogAddForwardPortVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog
                header='EDIT PORT' 
                visible={isDialogEditForwardPortVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditForwardPortVisible(false)}
                maximizable
            >
                <Portforwardingeditform visibleDialog={setIsDialogEditForwardPortVisible} edit={edit} get={get} selectedItem={selectedItem} selectedForwardPort={selectedForwardPort}/>
            </Dialog>
        </div>
    );
};
