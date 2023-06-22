import Button from "../buttons/button.component";
import "../../css/buy-ticket-button.css";
 
type typeOfBuyButtonParams = {
    onClickFunction : Function
}

const BuyButton = ({onClickFunction}:typeOfBuyButtonParams)=>{
    return <div className = "buy-ticket-button-div">

    <Button title = "Vásárlás" onClickFunction={onClickFunction} />

    </div>
}

export default BuyButton;