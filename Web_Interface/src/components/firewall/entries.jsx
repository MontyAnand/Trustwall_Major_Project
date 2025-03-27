import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Entryaddform } from "./entriesadd_form";
import { Entryeditform } from "./entriesedit_form";

export const Entry = ({ entries, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.ipset); 

    const [isDialogAddEntryVisible, setIsDialogAddEntryVisible] = useState(false);
    const [isDialogEditEntryVisible, setIsDialogEditEntryVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const actionEdit = (selectedEntry) => {
        setSelectedEntry(selectedEntry);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditEntryVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedEntry) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                try {
                    await dispatch(remove(selectedItem, selectedEntry));
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
                <DataTable value={entries}>
                    <Column field="entry" header="Entry"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddEntryVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddEntryVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddEntryVisible(false)}
                maximizable
            >
                <Entryaddform visibleDialog={setIsDialogAddEntryVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog
                header='EDIT PORT' 
                visible={isDialogEditEntryVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditEntryVisible(false)}
                maximizable
            >
                <Entryeditform visibleDialog={setIsDialogEditEntryVisible} edit={edit} get={get} selectedItem={selectedItem} selectedForwardPort={selectedEntry}/>
            </Dialog>
        </div>
    );
};
