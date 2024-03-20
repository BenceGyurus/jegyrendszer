import { Button } from "antd";
import "../../css/buyButton.css";
type typeOfBuyButtonParams = {
    onClickFunction : Function,
    disabled? : boolean,
    loading? : boolean
}
const BuyButton = ({onClickFunction, disabled, loading}:typeOfBuyButtonParams)=>{
    return <Button loading  = {loading} disabled = {disabled} className="buy-btn white-color-buy-button" type="primary" onClick={()=>onClickFunction()}>Vásárlás</Button>
}

export default BuyButton;