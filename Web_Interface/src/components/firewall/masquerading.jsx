import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { useDispatch, useSelector } from "react-redux"

export const Masquerading = ({ selectedItem, isMasquerading, get, add, remove }) => {

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector(state => state.zone);

    if (isLoading) return (
        <div className="card flex align-items-center justify-content-center m-3">
            <ProgressSpinner />
        </div>
    )

    return (
        <div className="flex justify-content-start w-full gap-3">
            <Checkbox checked={isMasquerading} onChange={ async (e) => {
                try {
                    if(e.value === true) {
                        await dispatch(add(selectedItem));
                        if(error) throw new Error(error);
                    }
                    else {
                        await dispatch(remove(selectedItem));
                        if(error) throw new Error(error);
                    }
                    await dispatch(get(selectedItem));
                    if(error) throw new Error(error);
                } catch (err) {

                }
            } }/>
            <label>Masquerade</label>
        </div>
    );
    
}