import { useEffect, useState } from "react";
import Loader from "../loader/loader.component";
import Page from "./page.component";

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

const EventPage = (params:any)=>{

    const [id, setId] = useState("");
    const [eventDatas, setEventDatas]:[any, Function] = useState();
    const [responsed, setResponsed]:[boolean, Function] = useState(false)

    useEffect(()=>{
        let idOfEvent = (window.location.pathname.split("/")[window.location.pathname.split("/").length-1]);
        fetch(`/event/${idOfEvent}`)
        .then(async (response:any)=>{
            let datas = await response.json();
            setResponsed(true)
            if (!datas.error){
                setEventDatas(datas);
            }
        });
        setId(idOfEvent);
    }, []);


   return (
    <div>
        {
            !responsed ? <Loader /> : eventDatas ? <div><Page title = {eventDatas.title} background={eventDatas.background} description={eventDatas.description} id = {eventDatas.id} date = {eventDatas.date} tickets = {eventDatas.tickets} placeDatas = {eventDatas.places}/></div> : ""
        }
    </div>
)
}


export default EventPage;