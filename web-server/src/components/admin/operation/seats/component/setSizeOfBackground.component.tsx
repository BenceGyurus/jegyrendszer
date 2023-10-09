import { useState,useRef, useEffect } from "react";
import Checkbox from "../../../../checkbox/checkbox.component"
import InputNumber from "../../../../input/inputNumber.component";
type typeOfSetSizeOfBackgroundParams = {
    width : number,
    height : number,
    setWidth : Function,
    setHeight : Function,
    scale : boolean,
    setScale : Function
}
const SetSizeOfBackground = ( { width, height, setWidth, setHeight, scale, setScale }:typeOfSetSizeOfBackgroundParams )=>{
    const [ holdScale, setHoldScale ] = useState(true);

    return (
        <div className = "">
            <Checkbox onChangeFunction={setScale} defaultChecked = {scale} title = "Oldalarány megtartása" />
            <div>
                <InputNumber sufix="px" title = "Szélesség" value = {width <= 0.9 ? "" : Math.round(width)} onChangeFunction = {setWidth} />
                <InputNumber sufix="px" title = "Magasság" value = {width <= 0.9 ? "" : Math.round(height)} onChangeFunction = {setHeight} disabled = {scale}/>
            </div>
        </div>
    )
}


export default SetSizeOfBackground;