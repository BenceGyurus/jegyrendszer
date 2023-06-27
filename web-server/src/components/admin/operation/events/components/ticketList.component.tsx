import Ticket from "./ticket.component";
import { v4 as uuid } from 'uuid';

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
    return <div className = "ticket">
        {
            tickets.map((ticket)=>{
                return <Ticket ticket = {ticket} sizeOfSeat = {sizeOfSeat} sizeOfArea = {sizeOfArea} seatsDatas = {seatDatas} deleteFunction = {deleteFunction} editFunction = {editFunction} key={uuid()} />
            }
            )
        }
    </div>
}

export default TicketList