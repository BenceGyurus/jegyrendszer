import postData from "../../../connection/request";
import { useEffect, useState } from "react";
import Error from "../../../notification/error.component";
import Notification from "../../../notification/notification.component";
import EventDetails from "./event-details.component";
import "../../../../css/local-sale-event.css"
import Tickets from "../../../event-page/tickets.component";

type typeOfSeat = {
    group : string,
    id : string,
    name : string,
    posX : number,
    posY : number,
    title : string,
    ticketId? : string
}

type typeOfPlaces = {
    background : {isImage : boolean, name : "string"},
    colorOfBackground : string,
    colorOfSeat : string,
    seatsDatas : typeOfSeat,
    sizeOfArea : {width : number, height : number},
    sizeOfSeat : number
}

type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string
}

type typeOfEventDatas = {
    date : string,
    description : string,
    places : Array<typeOfPlaces>,
    tickets : Array<typeOfTicket>,
    title : string
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

const Local_Sale_Event = ()=>{

    const genereateTicketAmout = (tickets:any):Array<typeOfAmountTicket>=>{
        let newList:Array<typeOfAmountTicket> = [];
        for (let i = 0; i < tickets.length; i++){
            newList.push({...tickets[i], amount : 0, selected : 0})
        }
        return newList;
    }

    const [eventDatas, setEventDatas]:[any, Function] = useState();
    const [error, setError] = useState("");
    const [amountTickets, setAmountTickets] = useState(genereateTicketAmout(eventDatas ? eventDatas.tickets : {}));
    const [selectedTickets, setSelectedTickets]:[Array<string>, Function] = useState([]);

    const incrementAmountOfTickets = (id:String)=>{
        let l = [...amountTickets];
        for (let i = 0; i < l.length; i++){
            if (l[i].id === id && l[i].amount < l[i].numberOfTicket){
                l[i].amount++;
            }
        }
        setAmountTickets(l);
    }

    const decrementAmountOfTickets = (id:string) => {
        let l = [...amountTickets];
        let newList:Array<string> = [];
        for (let i = 0; i < l.length; i++){
            if (l[i].id === id && l[i].amount > 0){
                l[i].amount--;
                if (l[i].selected > 0){
                    l[i].selected--;
                }
                let deleted = false;
                if (l[i].selected >= l[i].amount){
                let lamdba = [...selectedTickets];
                for (let j = lamdba.length-1; j >= 0; j--){
                    if (!l[i].places.includes(lamdba[j]) || deleted){
                        newList.push(lamdba[j]);
                    }
                    if (l[i].places.includes(lamdba[j])){
                        deleted = true;
                    }
                }
                setSelectedTickets(newList);
                }
            }
        }
        setAmountTickets(l);
    }

    useEffect(()=>{
        let id = window.location.pathname.split("/")[3]
        fetch(`/event/${id}`)
        .then(
            async (response:any)=>{
               response = await response.json();
               if (!response.error){
                setEventDatas(response);
                setAmountTickets(genereateTicketAmout(response.tickets));
               }else{

               }
            }
        );
    }, []);

    console.log(amountTickets);

    return (
            <div>
                {error ? <Notification element={<Error message={error} />} /> : ""}
                {eventDatas ? <EventDetails title = {eventDatas.title} description={eventDatas.description} image = {eventDatas.background} /> : ""}
                {eventDatas ? <Tickets tickets = {amountTickets} incrementFunction={incrementAmountOfTickets} decrementFunction={decrementAmountOfTickets} /> : ""}

            </div>
        );
}

export default Local_Sale_Event;