import "../../css/checkbox.css";
import { v4 as uuid } from 'uuid';
type typeOfCheckboxParams = {
    onChangeFunction : Function,
    defaultChecked : boolean,
    title? :string,
    className? : string,
    id? : string,
    params? : any
}
const Checkbox = ({onChangeFunction, defaultChecked, title, className, id, params}:typeOfCheckboxParams):any=>{
    const idOfCheckBox = id ? id : uuid();
    return (
        title ? 
        <div className = {className}>
        <label className = "checkBoxLabel" htmlFor={idOfCheckBox}>{title}</label>
        <label className="toggle-switch">
        <input type="checkbox" onChange={ e => { !params ? onChangeFunction(e.target.checked) : onChangeFunction(e.target.checked, ...params)} } id = {idOfCheckBox} defaultChecked={defaultChecked}/>
        <span className="slider"></span>
        </label> 
        </div>: 
        <label className={`toggle-switch ${className}`}>
        <input type="checkbox" onChange={ e => {!params ? onChangeFunction(e.target.checked) : onChangeFunction(e.target.checked, ...params)} } id = {id} defaultChecked={defaultChecked}/>
        <span className="slider"></span>
        </label>
    )
}

export default Checkbox;