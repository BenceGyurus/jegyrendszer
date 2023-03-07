import "../../css/checkbox.css";
import { v4 as uuid } from 'uuid';
type typeOfCheckboxParams = {
    onChangeFunction : Function,
    defaultChecked : boolean,
    title? :string
}
const Checkbox = ({onChangeFunction, defaultChecked, title}:typeOfCheckboxParams):any=>{
    const idOfCheckBox = uuid();
    return (
        title ? 
        <div>
        <label className = "checkBoxLabel" htmlFor={idOfCheckBox}>{title}</label>
        <label className="toggle-switch">
        <input type="checkbox" onChange={ e => onChangeFunction(e.target.checked) } id = {idOfCheckBox} defaultChecked={defaultChecked}/>
        <span className="slider"></span>
        </label> 
        </div>: 
        <label className="toggle-switch">
        <input type="checkbox" onChange={ e => onChangeFunction(e.target.checked) } defaultChecked={defaultChecked}/>
        <span className="slider"></span>
        </label>
    )
}

export default Checkbox;