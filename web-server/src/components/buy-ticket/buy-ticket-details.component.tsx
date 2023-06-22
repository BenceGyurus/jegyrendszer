import TicketList from "./buy-ticket-ticketList.component"

type typeOfDeitalsParams = {
    tickets : Array<typeOfTickets>
    fullPrice : number,
    nameOfEvent : string,
}

type typeOfTickets = {
    name : string,
    places : Array<string> | boolean,
    amount : number,
    price : number,
}

const Details = ({tickets, fullPrice, nameOfEvent}:typeOfDeitalsParams)=>{
    return (
        <div>

            <h3>{nameOfEvent}</h3>
            <TicketList tickets = {tickets} />
            <h4>{fullPrice}Ft</h4>
        </div>
    )
}

export default Details;