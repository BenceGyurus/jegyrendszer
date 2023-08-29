import Ticket from "./Ticket.component"
import "../../css/select-ticket.css";
type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    seats : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number,
    numberOfFreeTickets : number
}

type typeOfTicketsParams = {
    tickets : Array<typeOfTicket>,
    incrementFunction : Function,
    decrementFunction : Function
}

const Tickets = ({tickets, incrementFunction, decrementFunction}:typeOfTicketsParams)=>{

    const getPriceOfAllSelected = (tickets:Array<typeOfTicket>)=>{
        let summ = 0;
        for (let i = 0; i < tickets.length; i++){
            summ += tickets[i].amount * tickets[i].price;
        }
        return summ;
    }

    return (
        <div className="user-page-ticket" id = "tickets">
            <div className = "ticket-selector">
      {tickets.map((ticket)=>{
            console.log(ticket.numberOfFreeTickets);
                return <Ticket name = {ticket.name} price = {ticket.price} amount = {ticket.amount} id = {ticket.id} incrementFunction={incrementFunction} decrementFunction={decrementFunction} key = {ticket.id} free = {ticket.numberOfFreeTickets} />
                })
            }
            <div className="total-price" id="total-price">
                Összesen: {getPriceOfAllSelected(tickets)}Ft
            </div>
            </div>
        </div>
    )
}


export default Tickets;