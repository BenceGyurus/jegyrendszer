import Seat from "./seat.component";
import "../../css/selectTickets.css"
import Stage from "./stage.component";
import { useEffect, useState } from "react";
import SeatVisualization from "../seat-visualization-engine/seats.component";
import typeOfStage from "../seat-visualization-engine/types/typeOfStage";

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
    stages : Array<typeOfStage>,
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
    boughtPlaces : Array<string>,
    types: any
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
        let widthOfArea = window.innerWidth*0.8 > 500 ? 500 : window.innerWidth*0.8;
        if (places){
            places.seats.forEach((seat:any, index:number)=>{
                if (index === 0 || maxX < seat.x+seat.size.width){maxX = seat.x+seat.size.width};
                if (index === 0 || maxY < seat.y){maxY = seat.y};
            })
            if (places.stages){
                places.stages.forEach((stage, index)=>{
                    if (maxX === 0 || maxX < stage.x+stage.width){maxX = stage.x+stage.width};
                    if (maxY === 0 || maxY < stage.y){maxY = stage.y};
                });
            }
        }
        return {
            width : maxX,
            height : maxY+120
        }
    }



    return (<div className = "select-ticket-main-div">
            <SeatVisualization stages={places.stages} disabled = {disabled} tickets = {tickets} seatPositions={places.seats} sizeOfArea={getSizeOfArea()} colorOfSeat={places.colorOfSeat} seatSize={places.sizeOfSeat} selectedSeats={seleted} selectFunction={onClickFunction} />
        </div>);
}

export default Seats;
