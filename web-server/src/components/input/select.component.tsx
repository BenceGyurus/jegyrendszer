import "../../css/select.css";
import { useRef, useEffect } from "react";
type typeOfOption = {
    title : string,
    value : string
}
type typesOfSelectParams = {
    options : Array<typeOfOption>,
    onChangeFunction? : Function,
    className? : string,
    value? : string,
    title? : string
}
const Select = ({options, onChangeFunction, className, value, title}:typesOfSelectParams)=>{

    const selectRef:any = useRef(null);

    useEffect(()=>{
        if (selectRef && selectRef.current && value){
            selectRef.current.value = value;
        }
        else if (selectRef && selectRef.current && !value){
            selectRef.current.value = "default";
        }
    }, []);

    return (
        <div>
            <label htmlFor="select" className = "select-label">{title}</label>
            <select ref={selectRef} className = {className ? `select ${className}` : "select"} name="" id="select" onChange={e =>onChangeFunction ? onChangeFunction(e.target.value) : ""} value={value}>
                <option value="default">-</option>
                {options.map(
                    (option)=>{
                        return <option value={option.value}>{option.title}</option>;
                    }
                )}
            </select>
        </div>
    );
}

export default Select;