import Coupon from "./admin-coupon.component";
import { v4 as uuid } from 'uuid';

type typeOfCoupon = {
    _id : string,
    name : string,
    amount : number,
    money : boolean,
    usedEvent : Array<string>,
    usedTicket : number,
    validity : string
}


type typeOfRefCodeListParams = {
    coupons : Array<typeOfCoupon>,
    editFunction : Function,
    deleteFunction : Function
}

const RefCodeList = ({coupons, editFunction, deleteFunction}:typeOfRefCodeListParams)=>{
    return (
        <div>
            {
                coupons.map((element)=>{
                    return <Coupon key = {uuid()} coupon={element} editFunction = {editFunction} deleteFunction = {deleteFunction} />
                })
            }
        </div>
    )
}

export default RefCodeList;