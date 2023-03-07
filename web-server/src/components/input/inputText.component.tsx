import { useRef,useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import "../../css/inputStyle.css";
type typeOfInputTextParams = {
    title : string,
    onChangeFunction : Function,
    value? : string
}
const InputText = ({ title,onChangeFunction,value }:typeOfInputTextParams)=>{
    const inputRef:any = useRef(null);
    let id = uuid();

    useEffect(()=>{
        if (inputRef.current && value){inputRef.current.value = value}
    })

    return (
        <div>
            <label htmlFor={id} className = "inputLabel">{title}</label>
            <input type="text" className = "textInput" onChange={e => {onChangeFunction(e.target.value)}} ref = {inputRef}/>
        </div>
    );
}

export default InputText;