import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Sourceportaddform } from "./sourceportsadd_form";
import { Sourceporteditform } from "./sourceportsedit_form";

export const Sourceports = ({ sourcePorts, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone); 

    const [isDialogAddSourcePortVisible, setIsDialogAddSourcePortVisible] = useState(false);
    const [isDialogEditSourcePortVisible, setIsDialogEditSourcePortVisible] = useState(false);
    const [selectedSourcePort, setSelectedSourcePort] = useState(null);

    const actionEdit = (selectedSourcePort) => {
        setSelectedSourcePort(selectedSourcePort);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditSourcePortVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedSourcePort) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                try {
                    await dispatch(remove(selectedItem, selectedSourcePort.port, selectedSourcePort.protocol));
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
                <DataTable value={sourcePorts}>
                    <Column field="port" header="Port"></Column>
                    <Column field="protocol" header="Protocol"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddSourcePortVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddSourcePortVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddSourcePortVisible(false)}
                maximizable
            >
                <Sourceportaddform visibleDialog={setIsDialogAddSourcePortVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog 
                header='EDIT PORT' 
                visible={isDialogEditSourcePortVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditSourcePortVisible(false)}
                maximizable
            >
                <Sourceporteditform visibleDialog={setIsDialogEditSourcePortVisible} edit={edit} get={get} selectedItem={selectedItem} selectedSourcePort={selectedSourcePort}/>
            </Dialog>
        </div>
    );
};
