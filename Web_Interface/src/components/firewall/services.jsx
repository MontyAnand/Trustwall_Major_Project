import { Checkbox } from "primereact/checkbox";
import { useDispatch, useSelector } from "react-redux"
import { ProgressSpinner } from "primereact/progressspinner";

export const Services = ({ servicesList, selectedItem, services, get, add, remove }) => {
    // const dispatch = useDispatch();
    // const { isLoading, error } = useSelector(state => state.zone);

    // if (isLoading) return (
    //     <div className="card flex align-items-center justify-content-center m-3">
    //         <ProgressSpinner />
    //     </div>
    // )

    // return (
    //     <div className="flex flex-column w-full gap-3 m-3">
    //         {
    //             servicesList.map(({ service }) => (
    //                 <div className="flex justify-content-start w-full gap-3">
    //                     <Checkbox checked={services[service]} onChange={ async (e) => {
    //                         try {
    //                             if(e.checked === true) {
    //                                 await dispatch(add(selectedItem, service));
    //                                 if(error) throw new Error(error);
    //                             }
    //                             else {
    //                                 await dispatch(remove(selectedItem, service));
    //                                 if(error) throw new Error(error);
    //                             }
    //                             await dispatch(get(selectedItem));
    //                             if(error) throw new Error(error);
    //                         } catch (err) {

    //                         }
    //                     } }/>
    //                     <label>{service}</label>
    //                 </div>
    //             ))
    //         }
    //     </div>
    // );
}