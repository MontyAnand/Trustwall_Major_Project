import React,{useState} from "react";
import InternalCustomDHCP from "../InternalCustomDHCP";


const CustomDHCPBtn = ()=>{
    const [data,setData] = useState([]);

    const AddComponents = ()=>{
        setData([...data,data.length+1]);
    }

    return(
        <>
            <button onClick={AddComponents}>Add Custom Options</button>
            <>
                {data.map((c)=>
                    <InternalCustomDHCP count={c}/>
                )}
            </>
        </>
    );
};
 export default CustomDHCPBtn;