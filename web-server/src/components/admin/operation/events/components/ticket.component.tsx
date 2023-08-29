import SmallMap from "../../../adminComponents/smallMap.component";
import { v4 as uuid } from 'uuid';
import "../../../../../css/edit-ticket.css";
import TicketPriceChart from "./ticketPrice.component";
import TicketCounter from "./numberOfTicket.component";

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
    return  <div className = "edit-ticket-div" key={uuid()}>
      <div className="ticket-counter">
      <div className="event-info">
        <div className="ticket-title">{ticket.name}</div>
        <div className="ticket-price">${ticket.price}</div>
      </div>
      <div className="ticket-info">
        <div className="ticket-count">{ticket.numberOfTicket}</div>
        <div className="ticket-label">Tickets</div>
      </div>
    </div>
    <TicketPriceChart min={ticket.minPrice} max={ticket.maxPrice} normal={ticket.price} />
    <SmallMap sizeOfArea={sizeOfArea} colorOfBackGround = "white" colorOfSeat="black" seatDatas={seatsDatas} sizeOfSeats = {sizeOfSeat} selectedSeats = {ticket.seats} selectColor = "red" />
    <button className = "edit-button ticket-button" onClick={e=>editFunction(ticket.id)}>Szerkesztés</button>
    <button className = "delete-button ticket-button" onClick={e=>deleteFunction(ticket.id)} >Törlés</button> 
    </div>
}

export default Ticket;