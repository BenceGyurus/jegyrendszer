import { useState,useRef, useEffect } from "react";
import Checkbox from "../../../../checkbox/checkbox.component"
import InputNumber from "../../../../input/inputNumber.component";
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
            <Checkbox onChangeFunction={setHoldScale} defaultChecked = {holdScale} title = "Oldalarány megtartása" />
            <div>
                <InputNumber title = "Szélesség" value = {width <= 0.9 ? "" : Math.round(width)} onChangeFunction = {setWidth} functionParams = {[holdScale]} />
                <InputNumber title = "Magasság" value = {width <= 0.9 ? "" : Math.round(height)} onChangeFunction = {setHeight} disabled = {holdScale}/>
            </div>
        </div>
    )
}

//<label htmlFor="width">Szélesség:</label><input type="number" name="width" value = {width <= 0.9 ? "" : Math.round(width)} id="width" onChange={(event:any) => {}} /><label htmlFor="height">Magasság:</label> <input type = "number" name = "height" id = "height" onChange={event => setHeight(Number(event.target.value))} disabled={holdScale} value = {height <= 0.9 ? "" : Math.round(height)} defaultValue = {Math.ceil(height)}/>

export default SetSizeOfBackground;