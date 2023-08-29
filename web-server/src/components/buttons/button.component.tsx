import "../../css/button.css";
type typeOfButtonParams = {
    title? : string,
    onClickFunction : Function,
    disabled? : boolean
}

const Button = ( { title, onClickFunction, disabled }:typeOfButtonParams )=>{
    return <input value = {title} type = "button" onClick={(e)=>{onClickFunction()}} className = "button-template" disabled = {disabled ? disabled : false} />
}
export default Button;