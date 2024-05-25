import Window from "../../../window/window.component";
import typeOfReportParams from "./types/reportParams";

const Report = ({closeFunction, open}:typeOfReportParams)=>{

    return (open ? <Window title="Report ablak" closeFunction={()=>closeFunction()}>
        <h1></h1>
    </Window> : <></>)
};

export default Report;