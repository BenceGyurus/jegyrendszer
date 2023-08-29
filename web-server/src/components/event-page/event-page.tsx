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
    title : string,
    position : typeOfCenter,
    location : string,
    address : string
}

type typeOfCenter = {
    lat : number,
    lng : number
}

const EventPage = (params:any)=>{

    const [id, setId] = useState("");
    const [eventDatas, setEventDatas]:[any, Function] = useState();
    const [responsed, setResponsed]:[boolean, Function] = useState(false);

    const parseMedia = (media:any)=>{
        Object.keys(media).forEach((key)=>{
            if (media[key]){
                media[key] = media[key].replaceAll("!equal!", "=");
                media[key] = media[key].replaceAll("!end!", "&")
            }
        })
        return media;
    }

    useEffect(()=>{
        let idOfEvent = (window.location.pathname.split("/")[window.location.pathname.split("/").length-1]);
        fetch(`/api/v1/event/${idOfEvent}`)
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
            !responsed ? <Loader /> : eventDatas ? <div><Page title = {eventDatas.title} background={eventDatas.background} description={eventDatas.description} id = {eventDatas.id} date = {eventDatas.date} placeDatas = {eventDatas.places} media = {parseMedia(eventDatas.media)} position = {eventDatas.position} location ={eventDatas.location} address = {eventDatas.address} ticketId={(window.location.pathname.split("/")[window.location.pathname.split("/").length-1])} venueId={eventDatas.venue} /></div> : ""
        }
    </div>
)
}


export default EventPage;