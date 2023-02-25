import "../../css/checkbox.css";
type typeOfCheckboxParams = {
    onChangeFunction : Function,
    defaultChecked : boolean
}
const Checkbox = ({onChangeFunction, defaultChecked}:typeOfCheckboxParams):any=>{
    return (
        <label className="toggle-switch">
        <input type="checkbox" onChange={ e => onChangeFunction(e.target.checked) } defaultChecked={defaultChecked}/>
        <span className="slider"></span>
        </label>
    )
}

export default Checkbox;