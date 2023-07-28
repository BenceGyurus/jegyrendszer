type typeOfDiscount = {
    name : string,
    amount : number,
    money : boolean,
    _id : string
}

type typeOfLocalDiscountParams = {
    discount : typeOfDiscount
    editFunction : Function,
    deleteFunction : Function
}

const LocalDiscount = ({discount, editFunction, deleteFunction}:typeOfLocalDiscountParams)=>{

    return (
        <div className = "coupon" key = {discount._id}>
            <div className = "coupon-code">
            <h3 className = "code">{discount.name}</h3>
            </div>
            <div className = "coupon-details">
            <p className = "discount-amount">{discount.amount}{discount.money ? "Ft" : "%"}</p>
            </div>
            <button className = "edit-button" onClick={e=>{editFunction(discount._id)}}>Szerkesztés</button>
            <button className = "delete-button" onClick={e=>{deleteFunction(discount._id)}}>Törlés</button>
        </div>
    ) 

}
export default LocalDiscount;