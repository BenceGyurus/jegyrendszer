import Seat from "./seat.component";
import "../../css/selectTickets.css"
import Stage from "./stage.component";
import { useState } from "react";
import SeatVisualization from "../seat-visualization-engine/seats.component";

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
    stage : number,
}

type typeOfAmountTicket = {
    id : string,
    numberOfTicket : number,
    seats : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number,
    pendingPlaces : Array<string>,
    boughtPlaces : Array<string>
}

type typeOfSeatsParams = {
    places : typeOfPlaces,
    tickets : Array<typeOfAmountTicket>,
    seleted : Array<string>,
    onClickFunction : Function
}
const Seats = ({places, tickets, seleted,onClickFunction}:typeOfSeatsParams)=>{

    console.log(places, tickets);

    const [marginTop, setMarginTop] = useState(100);

    const getMinX = ()=>{
        let min = 0;
        /*places.seatsDatas.forEach((place:any) => {
                if (min === -1){ min = place.posX}
                else if (min > place.posX){
                    min = place.posX;
                }
        });*/
        return places.sizeOfArea.width > window.innerWidth ? min-100 : 0;
    }

    const getSizeOfStage = (type:number, sizeOfArea:{width : number, height : number})=>{
        return {
            width : type == 1 || type == 4 ? sizeOfArea.width * 0.3 : 50,
            height : type == 2 || type == 3 ? sizeOfArea.height * 0.3 : 50,
            x : type == 1 || type == 4 ? sizeOfArea.width/2-(sizeOfArea.width * 0.3/2) : type == 2 ? 10 : sizeOfArea.width-50,
            y : type == 2 || type == 3 ? sizeOfArea.height / 2 - (sizeOfArea.height * 0.3/2) : type == 1 ? 10 : sizeOfArea.height-50
        }
    }


    return (<div className = "select-ticket-main-div">
            <SeatVisualization tickets = {tickets} seatPositions={places.seatsDatas} sizeOfArea={places.sizeOfArea} colorOfSeat={places.colorOfSeat} seatSize={places.sizeOfSeat} stage={getSizeOfStage(places.stage, places.sizeOfArea)} marginTop={places.stage == 1 || places.stage == 4 ? 50 : 0} marginLeft={places.stage == 3 || places.stage == 2 ? 50 : 0} selectedSeats={seleted} selectFunction={onClickFunction} />
        </div>);
}

export default Seats;


/*
<div style = {{display: "flex", alignItems : "center", justifyContent : "center"}}>
        <div className = "selectTickets" style={{height : (places.sizeOfArea.height+2*marginTop), background: places.colorOfBackground, width:places.sizeOfArea.width}}>
        {places.stage == 1 ? <Stage top = {marginTop} sizeOfArena={places.sizeOfArea} type = {places.stage}  left = {getMinX()/2} classNameList={["user-side-top-stage"]} /> : ""}
        {places.stage == 2 ? <Stage top = {marginTop} sizeOfArena={places.sizeOfArea} type = {places.stage} left = {getMinX()/2} classNameList={["user-side-left-stage"]} isVertical = {true} /> : ""}
        {
            tickets.map((ticket:typeOfAmountTicket)=>{
                return ticket.places.map((place:string)=>{
                    return places.seatsDatas.map((seat:typeOfSeat)=>{
                        return place === seat.id ? <Seat marginLeft = {getMinX()/2} marginTop = {marginTop} color={places.colorOfSeat} seat={seat} size = {places.sizeOfSeat} classname = {!ticket.boughtPlaces.includes(seat.id) ? !ticket.pendingPlaces.includes(seat.id) ? ticket.amount > 0 ? seleted.includes(seat.id) ? "user-selected"  : ticket.selected >= ticket.amount ? "user-disabled" : "user-allowed" : "user-disabled" : "user-pending" : "user-bought"} onClickFunction = {onClickFunction} /> : "";
                    })
                })
            })
        }
         {places.stage == 3 ? <Stage top = {marginTop} sizeOfArena={places.sizeOfArea} type = {places.stage} left = {getMinX()/2} classNameList={["user-side-right-stage"]} isVertical = {true} /> : ""}
         {places.stage == 4 ? <Stage top = {marginTop} sizeOfArena={places.sizeOfArea} type = {places.stage} left = {getMinX()/2} classNameList={["user-side-bottom-stage"]} /> : "" }
    </div>
    </div>*/