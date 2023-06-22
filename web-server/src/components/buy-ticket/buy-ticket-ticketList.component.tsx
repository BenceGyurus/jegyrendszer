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
    return <div>
        {
            tickets.map((ticket)=>{
                return (
                    <div>
                        <h4>{ticket.name}</h4>
                        <span className = "price-of-ticket">{ticket.price}</span>
                        <span className = "amount-of-ticket">{ticket.amount}</span>
                    </div>
                )
            })
        }
    </div>
}

export default TicketList;