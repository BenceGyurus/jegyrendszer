import "../../css/buyButton.css";
type typeOfBuyButtonParams = {
    onClickFunction : Function
}
const BuyButton = ({onClickFunction}:typeOfBuyButtonParams)=>{
    return <button className="buy-btn" onClick={e=>onClickFunction()}>Vásárlás</button>
}

export default BuyButton;