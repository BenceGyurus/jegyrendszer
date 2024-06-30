import typeOfTicket from "../../ticket-sales/types/ticket";

export default interface typeOfReport{
    _id : string,
    local : boolean,
    time : number,
    fullPrice : number,
    tickets : Array<typeOfTicket>,
    eventId : string,
    id : string,
    event : string
    startDate : Date,
    endDate : Date
}