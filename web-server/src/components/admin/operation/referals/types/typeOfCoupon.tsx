type typeOfCoupon = {
    _id : string,
    name : string,
    amount : number,
    money : boolean,
    usedEvent : Array<string>,
    usedTicket : number,
    validity : string,
    events : Array<string>,
    type : number
}

export default typeOfCoupon