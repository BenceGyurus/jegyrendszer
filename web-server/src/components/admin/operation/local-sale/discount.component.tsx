import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import "../../../../css/local-sale-discount.css";

type typeOfDiscount = {
    name : string,
    amount : number,
    money : boolean,
    _id : string
}

type typeOfDiscountParams = {
    discount : typeOfDiscount,
    onClickFunction : Function,
    selected : boolean
}
const Discount = ({discount, onClickFunction,selected}:typeOfDiscountParams)=>{
    return ( 
    <div onClick = {e=>onClickFunction(discount._id)} className = {`local-discount-card${selected ? ` selected-discount-card` : ""}`}>
      <div className = "local-discount-card-title"><h3 className="discount-name">{discount.name}</h3>
      {selected ? <CheckCircleFilled color="#007bff" className = "local-discount-card-check-circle" /> : <CheckCircleOutlined className = "local-discount-card-check-circle"  color="#007bff" />}
      </div>
      <span className="discount-amount">{discount.amount}{discount.money ? "Ft" : "%"}</span>
    </div>
        )
}

export default Discount;