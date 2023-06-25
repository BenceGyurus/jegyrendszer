import "../../css/discount.css";

type typeOfDiscountParams = {
    name : string,
    amount : number,
    cash : boolean
}
const Discount = ({name, amount, cash}:typeOfDiscountParams)=>{
    return (
        <div className = "show-discount-div">
            <span className = "name-of-discount">{name}</span>
            <span className = "amount-of-discount">-{amount}{cash ? "Ft" : "%"}</span>
        </div>
    )
}

export default Discount;