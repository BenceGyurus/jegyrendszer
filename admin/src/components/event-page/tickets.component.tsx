import Ticket from "./Ticket.component"
import "../../css/select-ticket.css";

type typeOfAmountTypeOfTickets = {
    name : string,
    amount : number,
    id : string,
    price : number
}

type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    seats : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number,
    numberOfFreeTickets : number,
    types : Array<typeOfAmountTypeOfTickets>
}


type typeOfTicketsParams = {
    tickets : Array<typeOfTicket>,
    incrementFunction : Function,
    decrementFunction : Function
}

const sortFunction = (a:any,b:any)=>{
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
}


const Tickets = ({tickets, incrementFunction, decrementFunction}:typeOfTicketsParams)=>{


    const getPriceOfAllSelected = (tickets:Array<typeOfTicket>)=>{
        let summ = 0;
        for (let i = 0; i < tickets.length; i++){
            tickets[i].types.forEach((type)=>{
                summ += type.amount * type.price;
            });
        }
        return summ;
    }

    return (
        <div className="user-page-ticket" id = "tickets">
            <div className = "ticket-selector">
      {tickets.map((ticket)=>{
            return ticket.types.sort(sortFunction).map((type)=>{
                return <Ticket name = {type.name} typeId={type.id} price = {type.price} amount = {type.amount} id = {ticket.id}  incrementFunction={incrementFunction} decrementFunction={decrementFunction} key = {ticket.id} free = {ticket.numberOfFreeTickets} />
            });
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