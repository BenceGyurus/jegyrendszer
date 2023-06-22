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
            <label htmlFor="color">Szín</label>
            <input type="color" name="color" id="color" onChange={e=>setColor(e.target.value)} value = {color} />
        </div>
    );
}
export default SetColorOfBackground;