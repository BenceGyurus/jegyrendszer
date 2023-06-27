import Ticket from "./Ticket.component"
import "../../css/select-ticket.css";
type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number
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
            <h2 className = "tickets-title">Jegyek:</h2>
      {tickets.map((ticket)=>{
                return <Ticket name = {ticket.name} price = {ticket.price} amount = {ticket.amount} id = {ticket.id} incrementFunction={incrementFunction} decrementFunction={decrementFunction} key = {ticket.id}/>
                })
            }
            {getPriceOfAllSelected(tickets) ? <div className = "summend-price-box">
                <span className = "summend-price-title">Összesen:</span>
                <span className = "summend-price">{getPriceOfAllSelected(tickets)}Ft</span>
            </div> : <div className = "summed-price-box-space"></div>}
        </div>
    )
}


export default Tickets;