import { useState } from "react"
import Window from "../window/window.component";

type typeOfInfoParams = {
    text : string,
    title : string
}

const Info = ( { text, title }:typeOfInfoParams )=>{

    const [showWindow, setShowWindow] = useState(false);

    return <div>
        <i className="fas fa-info" onClick={()=>{setShowWindow(true)}} ></i>
        {showWindow ? <Window closeFunction={()=>setShowWindow(false)} title = {title} ><p>{text}</p></Window> : ""}
    </div>
}

export default Info;