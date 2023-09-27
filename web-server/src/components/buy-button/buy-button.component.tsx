import "../../css/buyButton.css";
type typeOfBuyButtonParams = {
    onClickFunction : Function,
    disabled? : boolean
}
const BuyButton = ({onClickFunction, disabled}:typeOfBuyButtonParams)=>{
    return <button disabled = {disabled} className="buy-btn" onClick={e=>onClickFunction()}>Vásárlás</button>
}

export default BuyButton;