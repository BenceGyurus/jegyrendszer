import Ticket from "./ticket.component"

type typeOfTicket = {
    id : string,
    seats : Array<string>,
    price : number,
    minPrice : number,
    maxPrice : number,
    name : string,
    numberOfTicket : number
}

type typeOfTicketList = {
    tickets : Array<typeOfTicket>,
    seatDatas : typeOfPlace,
    sizeOfSeat : number,
    sizeOfArea : {width: number, height: number},
    deleteFunction : Function,
    editFunction : Function
}

type typeOfPlace = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string
}

const TicketList = ( { tickets, sizeOfSeat, sizeOfArea, seatDatas,deleteFunction,editFunction }:typeOfTicketList )=>{
    console.log(tickets);
    return <div className = "ticket">
        {
            tickets.map((ticket)=>{
                return <Ticket ticket = {ticket} sizeOfSeat = {sizeOfSeat} sizeOfArea = {sizeOfArea} seatsDatas = {seatDatas} deleteFunction = {deleteFunction} editFunction = {editFunction} />
            }
            )
        }
    </div>
}

export default TicketList