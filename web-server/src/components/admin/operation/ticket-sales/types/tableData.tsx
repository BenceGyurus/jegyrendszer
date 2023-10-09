import typeOfTicket from "./ticket"
import typeOfCustomerDatas from "./customerData"

type typeOfDatas = {
    user : string, 
    coupon : string, 
    price : number, 
    local : boolean, 
    tickets : Array<typeOfTicket>,
    date : string, 
    fullPrice : number, 
    eventName : string, 
    eventId : string,
    buyId : string,
    customerName : string,
    cusotmerEmail : string,
    phoneNumber : string
}

export default typeOfDatas