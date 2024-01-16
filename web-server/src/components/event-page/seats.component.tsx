import Seat from "./seat.component";
import "../../css/selectTickets.css"
import Stage from "./stage.component";
import { useEffect, useState } from "react";
import SeatVisualization from "../seat-visualization-engine/seats.component";

type typeOfSeat = {
    group : string,
    id : string,
    name : string,
    x : number,
    y : number,
    title : string,
    size : {
        width : number,
        height : number
    },
    color : string
}

type typeOfPlaces = {
    background : {isImage : boolean, name : "string"},
    colorOfBackground : string,
    colorOfSeat : string,
    seats : Array<typeOfSeat>,
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
    onClickFunction : Function,
    disabled? : boolean
}
const Seats = ({places, tickets, seleted,onClickFunction, disabled}:typeOfSeatsParams)=>{

    const [marginTop, setMarginTop] = useState(100);

    /*const getMinX = ()=>{
        let min = 0;
        /*places.seatsDatas.forEach((place:any) => {
                if (min === -1){ min = place.posX}
                else if (min > place.posX){
                    min = place.posX;
                }
        });
        return places.sizeOfArea.width > window.innerWidth ? min-100 : 0;
    }*/


    const getSizeOfArea = ()=>{
        let maxX = 0;
        let maxY = 0;
        if (places){
            places.seats.forEach((seat:any, index:number)=>{
                if (index === 0 || maxX < seat.x+seat.size.width){maxX = seat.x+seat.size.width};
                if (index === 0 || maxY < seat.y){maxY = seat.y};
            })
        }
        return {
            width : maxX,
            height : maxY+120
        }
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
            <SeatVisualization disabled = {disabled} tickets = {tickets} seatPositions={places.seats} sizeOfArea={getSizeOfArea()} colorOfSeat={places.colorOfSeat} seatSize={places.sizeOfSeat} stage={getSizeOfStage(places.stage, getSizeOfArea())} marginTop={places.stage == 1 || places.stage == 4 ? 50 : 0} marginLeft={places.stage == 3 || places.stage == 2 ? 50 : 0} selectedSeats={seleted} selectFunction={onClickFunction} />
        </div>);
}

export default Seats;
