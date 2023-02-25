import { useState,useRef, useEffect } from "react";
import Checkbox from "../../../../checkbox/checkbox.component"
type typeOfSetSizeOfBackgroundParams = {
    width : number,
    height : number,
    setWidth : Function,
    setHeight : Function
}
const SetSizeOfBackground = ( { width, height, setWidth, setHeight }:typeOfSetSizeOfBackgroundParams )=>{
    const [ holdScale, setHoldScale ] = useState(true);

    return (
        <div className = "">
            <label htmlFor="hold-scale">Oldalarány megtartása</label>
            <Checkbox onChangeFunction={setHoldScale} defaultChecked = {holdScale} />
            <div><label htmlFor="width">Szélesség:</label><input type="number" name="width" value = {width <= 0.9 ? "" : Math.round(width)} id="width" onChange={(event:any) => {setWidth(Number(event.target.value),holdScale)}} /><label htmlFor="height">Magasság:</label> <input type = "number" name = "height" id = "height" onChange={event => setHeight(Number(event.target.value))} disabled={holdScale} value = {height <= 0.9 ? "" : Math.round(height)} defaultValue = {Math.ceil(height)}/></div>
        </div>
    )
}

export default SetSizeOfBackground;