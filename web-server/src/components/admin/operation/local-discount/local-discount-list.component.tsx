import LocalDiscount from "./local-discount.component"

type typeOfDiscount = {
    name : string,
    amount : number,
    _id : string,
    money : boolean
}

type typeOfLocalDiscountListParams = {
    discounts : Array<typeOfDiscount>,
    editFunction : Function,
    deleteFunction : Function,
}

const LocalDiscountList = ({discounts, editFunction, deleteFunction}:typeOfLocalDiscountListParams)=>{
    return (
        <div>
        {
        discounts.map((discount)=>{
            return <LocalDiscount discount={discount} editFunction={editFunction} deleteFunction={deleteFunction} />
        })
        }
        </div>
    )
}

export default LocalDiscountList;