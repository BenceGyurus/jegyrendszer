import { ColorPicker } from "antd";
import { useEffect, useRef } from "react";
type typeOfSetColorOfBackgroundParams = {
    color : string,
    setColor : Function
}


const SetColorOfBackground = ({setColor, color}:typeOfSetColorOfBackgroundParams)=>{
    const colorRef:any = useRef(null);
    useEffect(()=>{
        if (colorRef && colorRef.current){
            colorRef.current.value = color.length === 7 ? color : "#808080";
        }
    })
    return (
        <div>
            <ColorPicker defaultValue={color} style={{zIndex : 100000000}} onChange={(value)=>setColor(value.toHexString())} showText={(color) => <span>Szín kiválasztása ({color.toHexString()})</span>} />
        </div>
    );
}
export default SetColorOfBackground;