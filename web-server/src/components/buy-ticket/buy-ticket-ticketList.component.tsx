import "../../css/buy-ticket-ticket-list.css";

type typeOfTicketListParams = {
    tickets : Array<typeOfTicket>
};

type typeOfTicket = {
    name : string,
    places : Array<string> | boolean,
    amount : number,
    price : number,
}

const TicketList = ({tickets}:typeOfTicketListParams)=>{
    return <ul className = "tickets-overview">
        {
            tickets.map((ticket)=>{
                return (
                    <li>
                        <span className = "price-and-amount-sum">
                        <span className = "name-of-ticket">{ticket.name}</span>
                        <span className = "amount-of-ticket">({ticket.amount})</span>
                        </span>
                        <span className = "price-of-ticket buy-ticket-overview-price">{ticket.price}Ft</span>
                    </li>
                )
            })
        }
    </ul>
}

export default TicketList;