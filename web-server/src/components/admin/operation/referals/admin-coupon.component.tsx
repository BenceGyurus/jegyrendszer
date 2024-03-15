import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../../../../css/admin-coupon.css";
import { Card } from "antd";
type typeOfCoupon = {
    _id : string,
    name : string,
    amount : number,
    money : boolean,
    usedEvent : Array<string>,
    usedTicket : number,
    validity : string
}

type typeOfCouponParams = {
    coupon : typeOfCoupon,
    editFunction : Function,
    deleteFunction : Function
}

const Coupon = ({coupon, editFunction, deleteFunction}:typeOfCouponParams)=>{
    return (
        <Card title={coupon.name} className = "coupon" actions = {[ <DeleteOutlined onClick={e=>{deleteFunction(coupon._id)}} />, <EditOutlined onClick={e=>editFunction(coupon._id)} /> ]} bordered={false} style={{ width: 300 }}>
            <div className="coupon-details">
                <p>Discount Amount: <span className="discount-amount">{coupon.amount}{coupon.money ? "Ft" : "%"}</span></p>
                <p>Amount Used: <span className="amount-used">{coupon.usedTicket} times</span></p>
            </div>
            <div className="coupon-validity">
                Valid until: <span className="validity-date">{new Date(coupon.validity).getFullYear()}.{new Date(coupon.validity).getMonth()+1 > 9 ? new Date(coupon.validity).getMonth()+1 : `0${new Date(coupon.validity).getMonth()+1}`}.{new Date(coupon.validity).getDate() > 9 ? new Date(coupon.validity).getDate() : `0${new Date(coupon.validity).getDate()}`}. {new Date(coupon.validity).getHours() > 9 ? new Date(coupon.validity).getHours() : `0${new Date(coupon.validity).getHours()}`}:{new Date(coupon.validity).getMinutes() > 9 ? new Date(coupon.validity).getMinutes() : `0${new Date(coupon.validity).getMinutes()}`}</span>
            </div>
        </Card>
    )
}

export default Coupon;