import Seat from "./seat.component";
import "../../css/selectTickets.css"
import Stage from "./stage.component";

type typeOfSeat = {
    group : string,
    id : string,
    name : string,
    posX : number,
    posY : number,
    title : string
}

type typeOfPlaces = {
    background : {isImage : boolean, name : "string"},
    colorOfBackground : string,
    colorOfSeat : string,
    seatsDatas : Array<typeOfSeat>,
    sizeOfArea : {width : number, height : number},
    sizeOfSeat : number,
    stage : number
}

type typeOfAmountTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number
}

type typeOfSeatsParams = {
    places : typeOfPlaces,
    tickets : Array<typeOfAmountTicket>,
    seleted : Array<string>,
    onClickFunction : Function
}
const Seats = ({places, tickets, seleted,onClickFunction}:typeOfSeatsParams)=>{
    return (<div className = "select-ticket-main-div">
        {places.stage == 1 ? <Stage sizeOfArena={places.sizeOfArea} classNameList={["user-side-top-stage"]} /> : ""}
        <div style = {{display: "flex", alignItems : "center", justifyContent : "center"}}>
        {places.stage == 2 ? <Stage sizeOfArena={places.sizeOfArea} classNameList={["user-side-left-stage"]} isVertical = {true} /> : ""}
        <div className = "selectTickets" style={{height : places.sizeOfArea.height, background: places.colorOfBackground, maxWidth:places.sizeOfArea.width}}>
        {
            tickets.map((ticket:typeOfAmountTicket)=>{
                return ticket.places.map((place:string)=>{
                    return places.seatsDatas.map((seat:typeOfSeat)=>{
                        return place === seat.id ? <Seat color={places.colorOfSeat} seat={seat} size = {places.sizeOfSeat} classname = {ticket.amount > 0 ? seleted.includes(seat.id) ? "user-selected"  : ticket.selected >= ticket.amount ? "user-disabled" : "user-allowed" : "user-disabled"} onClickFunction = {onClickFunction} /> : "";
                    })
                })
            })
        }

    </div>
    {places.stage == 3 ? <Stage sizeOfArena={places.sizeOfArea} classNameList={["user-side-right-stage"]} isVertical = {true} /> : ""}
    </div>
    {places.stage == 4 ? <Stage sizeOfArena={places.sizeOfArea} classNameList={["user-side-bottom-stage"]} /> : "" }
    </div>);
}

export default Seats;