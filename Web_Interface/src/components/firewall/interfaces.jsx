import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Interfaceaddform } from "./interfacesadd_form";
import { Interfaceeditform } from "./interfacesedit_form";

export const Interface = ({ interfaces, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone); 

    const [isDialogAddInterfaceVisible, setIsDialogAddInterfaceVisible] = useState(false);
    const [isDialogEditInterfaceVisible, setIsDialogEditInterfaceVisible] = useState(false);
    const [selectedInterface, setSelectedInterface] = useState(null);

    const actionEdit = (selectedInterface) => {
        setSelectedInterface(selectedInterface);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditInterfaceVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedInterface) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                try {
                    await dispatch(remove(selectedItem, selectedInterface));
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
                <DataTable value={interfaces}>
                    <Column field="Interface" header="Interface"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddInterfaceVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddInterfaceVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddInterfaceVisible(false)}
                maximizable
            >
                <Interfaceaddform visibleDialog={setIsDialogAddInterfaceVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog
                header='EDIT PORT' 
                visible={isDialogEditInterfaceVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditInterfaceVisible(false)}
                maximizable
            >
                <Interfaceeditform visibleDialog={setIsDialogEditInterfaceVisible} edit={edit} get={get} selectedItem={selectedItem} selectedForwardPort={selectedInterface}/>
            </Dialog>
        </div>
    );
};
