import Ticket from "./ticket.component"

type typeOfTicket = {
    id : string,
    seats : Array<string>,
    price : number,
    minPrice : number,
    maxPrice : number,
    name : string
}

type typeOfTicketList = {
    tickets : Array<typeOfTicket>,
    seatDatas : typeOfPlace,
    sizeOfSeat : number,
    sizeOfArea : {width: number, height: number},
}

type typeOfPlace = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string
}

const TicketList = ( { tickets, sizeOfSeat, sizeOfArea, seatDatas }:typeOfTicketList )=>{
    return <div>
        {
            tickets.map((ticket)=>{
                return <Ticket ticket = {ticket} sizeOfSeat = {sizeOfSeat} sizeOfArea = {sizeOfArea} seatsDatas = {seatDatas} />
            }
            )
        }
    </div>
}

export default TicketList