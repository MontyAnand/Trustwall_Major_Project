import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Protocoladdform } from "./protocolsadd_form";
import { Protocoleditform } from "./protocolsedit_form";

export const Protocols = ({ protocols, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone); 

    const [isDialogAddProtocolVisible, setIsDialogAddProtocolVisible] = useState(false);
    const [isDialogEditProtocolVisible, setIsDialogEditProtocolVisible] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState(null);

    const actionEdit = (selectedProtocol) => {
        setSelectedProtocol(selectedProtocol);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditProtocolVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedProtocol) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                try {
                    await dispatch(remove(selectedItem, selectedProtocol));
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
                <DataTable value={protocols}>
                    <Column field="protocol" header="Protocol"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddProtocolVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddProtocolVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddProtocolVisible(false)}
                maximizable
            >
                <Protocoladdform visibleDialog={setIsDialogAddProtocolVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog 
                header='EDIT PORT' 
                visible={isDialogEditProtocolVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditProtocolVisible(false)}
                maximizable
            >
                <Protocoleditform visibleDialog={setIsDialogEditProtocolVisible} edit={edit} get={get} selectedItem={selectedItem} selectedProtocol={selectedProtocol}/>
            </Dialog>
        </div>
    );
};
