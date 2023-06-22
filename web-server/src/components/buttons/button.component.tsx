import "../../css/button.css";
type typeOfButtonParams = {
    title? : string,
    onClickFunction : Function
}

const Button = ( { title, onClickFunction }:typeOfButtonParams )=>{
    return <input value = {title} type = "button" onClick={(e)=>{onClickFunction()}} className = "button-template" />
}
export default Button;