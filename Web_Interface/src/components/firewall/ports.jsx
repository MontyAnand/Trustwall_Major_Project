import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Portaddform } from "./portsadd_form";
import { Porteditform } from "./portsedit_form";

export const Ports = ({ ports, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone); 

    const [isDialogAddPortVisible, setIsDialogAddPortVisible] = useState(false);
    const [isDialogEditPortVisible, setIsDialogEditPortVisible] = useState(false);
    const [selectedPort, setSelectedPort] = useState(null);

    const actionEdit = (selectedPort) => {
        setSelectedPort(selectedPort);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditPortVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedPort) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                try {
                    await dispatch(remove(selectedItem, selectedPort.port, selectedPort.protocol));
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
                <DataTable value={ports}>
                    <Column field="port" header="Port"></Column>
                    <Column field="protocol" header="Protocol"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddPortVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddPortVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddPortVisible(false)}
                maximizable
            >
                <Portaddform visibleDialog={setIsDialogAddPortVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog 
                header='EDIT PORT' 
                visible={isDialogEditPortVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditPortVisible(false)}
                maximizable
            >
                <Porteditform visibleDialog={setIsDialogEditPortVisible} edit={edit} get={get} selectedItem={selectedItem} selectedPort={selectedPort}/>
            </Dialog>
        </div>
    );
};
