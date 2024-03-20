import { v4 as uuid } from 'uuid';
import { useRef, useEffect } from 'react';
import "../../css/inputStyle.css";
type typeOfInputTextParams = {
    title : string,
    onChangeFunction : Function,
    value? : string
}
const Password = ({ title,onChangeFunction,value }:typeOfInputTextParams)=>{
    let id = uuid();

    const passwordRef:any = useRef(null);

    useEffect(()=>{
        if (passwordRef && passwordRef.current && value){
            passwordRef.current.value = value;
        }
    });

    return (
        <div>
            <label htmlFor={id} className = "inputLabel">{title}</label>
            <input id = {id} type="password" className = "textInput" onChange={e => {onChangeFunction(e.target.value)}}/>
        </div>
    );
}

export default Password;