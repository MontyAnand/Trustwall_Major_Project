import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";


export const Entryaddform = ({ visibleDialog, add, get, selectedItem }) => {

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.ipset);

    const [entry, setEntry] = useState('');

    const [okButtonDisabled, setOkButtonDisabled] = useState(true);

    return (
        <ScrollPanel style={{height: '120vh', width: '100%'}} className="flex flex-column">
            <div className="flex align-items-center justify-content-center w-full gap-3 m-3">
                <div style={{width: '20vw'}} className="flex align-items-center justify-content-end">
                    <label htmlFor="entry">Interface Name : </label>
                </div>
                <div style={{width: '60vw'}} className="flex align-items-center justify-content-start">
                    <InputText id="entry" value={entry} onChange={ (e) => {
                        setEntry(e.target.value);
                        setOkButtonDisabled(e.target.value === '');
                    } }/>
                </div>
            </div>
            <div className="flex align-items-center justify-content-end w-full gap-3 m-2">
                <Button icon='pi pi-times' label="Cancel" className="p-button-danger gap-2" onClick={() => visibleDialog(false)}/>
                <Button icon='pi pi-check' label="Ok" className="p-button-success gap-2" loading={isLoading} disabled={okButtonDisabled} onClick={ async () => {
                    try {
                        await dispatch(add(selectedItem, entry));
                        if(error) throw new Error(error);
                        await dispatch(get(selectedItem));
                        if(error) throw new Error(error);
                    } catch (err) {

                    }
                } }/>
            </div>
        </ScrollPanel>
    );
} 