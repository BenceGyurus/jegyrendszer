import Discount from "./discount.component"


type typeOfDiscount = {
    name : string,
    amount : number,
    money : boolean,
    _id : string
}

type typeOfDiscountListParams = {
    discounts : Array<typeOfDiscount>,
    selectedDiscount : string,
    onClikcFunction : Function
}
const DiscountList = ({discounts, selectedDiscount, onClikcFunction}:typeOfDiscountListParams)=>{
    return <div className="discounts-container">
        {discounts.map((discount)=>{
            return <Discount discount={discount} onClickFunction={onClikcFunction} selected = {selectedDiscount === discount._id} />
        })}
    </div>
}

export default DiscountList;