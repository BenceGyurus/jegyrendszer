import SmallMap from "../../../adminComponents/smallMap.component";
import { v4 as uuid } from 'uuid';

type typeOfTicket = {
    id : string,
    seats : Array<string>,
    price : number,
    minPrice : number,
    maxPrice : number,
    name : string
}

type typesOfTicketParams = {
    ticket : typeOfTicket,
    seatsDatas : any,
    sizeOfSeat : number,
    sizeOfArea : {width: number, height: number},
};

type typeOfPlace = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string
}

const Ticket = ( { ticket, sizeOfSeat,seatsDatas, sizeOfArea }:typesOfTicketParams )=>{
    return  <div key={uuid()}><h3>{ticket.name}</h3><h4>A jegyek ára: {ticket.price}Ft</h4>
    <h5>A jegyek maximum ára: {ticket.maxPrice}Ft</h5>
    <h5>A jegyek minimum ára: {ticket.minPrice}Ft</h5>
    <SmallMap sizeOfArea={sizeOfArea} colorOfBackGround = "white" colorOfSeat="black" seatDatas={seatsDatas} sizeOfSeats = {sizeOfSeat} selectedSeats = {ticket.seats} selectColor = "red" />
    </div>
}

export default Ticket;