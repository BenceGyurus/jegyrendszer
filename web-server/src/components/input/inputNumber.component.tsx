import { useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import "../../css/numberInputStyle.css";
type typeOfInputTextParams = {
    title : string,
    onChangeFunction : Function,
    value?:number|string,
    disabled? : boolean,
    functionParams? : Array<any>
}
const InputNumber = ({ title,onChangeFunction,value,disabled,functionParams }:typeOfInputTextParams)=>{
    let id = uuid();
    const numberInputRef:any = useRef(null);
    useEffect(()=>{
        if (numberInputRef.current && value){numberInputRef.current.value = value}
    })
    return (
        <div>
            <label htmlFor={id} className = "numberInputLabel">{title}</label>
            <input type="number" className = "inputNumber" onChange={e => functionParams ? onChangeFunction(Number(e.target.value), ...functionParams) : onChangeFunction(Number(e.target.value))} ref = {numberInputRef} disabled={disabled} />
        </div>
    );
}

export default InputNumber;