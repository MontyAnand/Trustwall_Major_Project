import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Sourceaddform } from "./sourcesadd_form";
import { Sourceeditform } from "./sourcesedit_form";

export const Source = ({ sources, selectedItem, get, add, remove, edit }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone); 

    const [isDialogAddSourceVisible, setIsDialogAddSourceVisible] = useState(false);
    const [isDialogEditSourceVisible, setIsDialogEditSourceVisible] = useState(false);
    const [selectedSource, setSelectedSource] = useState(null);

    const actionEdit = (selectedSource) => {
        setSelectedSource(selectedSource);
        return (
            <div className="flex gap-2">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" onClick={() => setIsDialogEditSourceVisible(true)}/>
            </div>
        );
    };
    
    const actionDelete = (selectedSource) => (
        <div className="flex gap-2">
            <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" loading={isLoading} onClick={ async () => {
                let sourceVal = '';
                if(selectedSource.sourceType === 'IP') sourceVal = selectedSource.source;
                else if(selectedSource.sourceType === 'MAC') sourceVal = `MAC:${selectedSource.source}`;
                else sourceVal = `ipset:${selectedSource.source}`;
                try {
                    await dispatch(remove(selectedItem, sourceVal));
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
                <DataTable value={sources}>
                    <Column field="sourceType" header="Type"></Column>
                    <Column field="source" header="Source"></Column>
                    <Column header="Edit" body={actionEdit}></Column>
                    <Column header="Delete" body={actionDelete}></Column>
                </DataTable>
            </div>
            <div className="flex m-3">
                <Button label="Add" icon="pi pi-plus" className="p-button-success gap-2" onClick={() => setIsDialogAddSourceVisible(true)}/>
            </div>
            <Dialog 
                header='ADD PORT' 
                visible={isDialogAddSourceVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogAddSourceVisible(false)}
                maximizable
            >
                <Sourceaddform visibleDialog={setIsDialogAddSourceVisible} add={add} get={get} selectedItem={selectedItem}/>
            </Dialog>
            <Dialog
                header='EDIT PORT' 
                visible={isDialogEditSourceVisible} 
                style={{height: '40vh', width: "40vw" }} 
                onHide={() => setIsDialogEditSourceVisible(false)}
                maximizable
            >
                <Sourceeditform visibleDialog={setIsDialogEditSourceVisible} edit={edit} get={get} selectedItem={selectedItem} selectedForwardPort={selectedSource}/>
            </Dialog>
        </div>
    );
};
