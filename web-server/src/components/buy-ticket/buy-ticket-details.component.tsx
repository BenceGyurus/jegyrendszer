import TicketList from "./buy-ticket-ticketList.component";
import Discount from "./used-discount.component";
import "../../css/buy-ticket-details.css";

type typeOfDeitalsParams = {
    tickets : Array<typeOfTickets>
    fullPrice : number,
    nameOfEvent : string,
    coupon : typeOfCoupon
}

type typeOfCoupon = {
    name : string,
    amount : number,
    money : boolean
}

type typeOfTickets = {
    name : string,
    places : Array<string> | boolean,
    amount : number,
    price : number
}

const Details = ({tickets, fullPrice, nameOfEvent, coupon}:typeOfDeitalsParams)=>{
    return (
        <div className = "overview">
            <h3 className = "name-of-event">{nameOfEvent}</h3>
            <TicketList tickets = {tickets} />
            {coupon.name ? <Discount name = {coupon.name} amount = {coupon.amount} cash = {coupon.money} /> : ""}
            <hr />
            <h4 className = "full-price">Összesen: <span className = "buy-ticket-overview-price">{coupon.amount ? coupon.money ? fullPrice >= coupon.amount ? fullPrice-coupon.amount : 0 : fullPrice-(fullPrice*(coupon.amount/100)) : fullPrice}Ft</span></h4>
        </div>
    )
}

export default Details;