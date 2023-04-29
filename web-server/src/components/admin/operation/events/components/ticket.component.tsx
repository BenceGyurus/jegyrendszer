import SmallMap from "../../../adminComponents/smallMap.component";
import { v4 as uuid } from 'uuid';
import "../../../../../css/edit-ticket.css";

type typeOfTicket = {
    id : string,
    seats : Array<string>,
    price : number,
    minPrice : number,
    maxPrice : number,
    name : string,
    numberOfTicket : number
}

type typesOfTicketParams = {
    ticket : typeOfTicket,
    seatsDatas : any,
    sizeOfSeat : number,
    sizeOfArea : {width: number, height: number},
    deleteFunction : Function,
    editFunction : Function
};

type typeOfPlace = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string
}

const Ticket = ( { ticket, sizeOfSeat,seatsDatas, sizeOfArea,editFunction, deleteFunction }:typesOfTicketParams )=>{
    return  <div className = "edit-ticket-div" key={uuid()}><h3>{ticket.name}</h3><h4>A jegyek ára: {ticket.price}Ft</h4>
    <h5>A jegyek maximum ára: {ticket.maxPrice}Ft</h5>
    <h5>A jegyek minimum ára: {ticket.minPrice}Ft</h5>
    <h5>A jegyek száma: {ticket.numberOfTicket}</h5>
    <SmallMap sizeOfArea={sizeOfArea} colorOfBackGround = "white" colorOfSeat="black" seatDatas={seatsDatas} sizeOfSeats = {sizeOfSeat} selectedSeats = {ticket.seats} selectColor = "red" />
    <button className = "edit-button ticket-button" onClick={e=>editFunction(ticket.id)}>Szerkesztés</button>
    <button className = "delete-button ticket-button" onClick={e=>deleteFunction(ticket.id)} >Törlés</button> 
    </div>
}

export default Ticket;