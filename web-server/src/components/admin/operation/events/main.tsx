import { useState, useEffect } from "react";
import EventSettings from "./components/event_Settings.component";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import postData from "../../../connection/request";


type typeOfTickets = {
    name : string,
    price : number,
    minPrice : number,
    maxPrice : number,
    seats : Array<string>
}
type typeOfCenter = {
    lat : number,
    lng : number
}

type typeOfDatasParams = {
    name? : string,
    description? : string,
    tickets? : typeOfTickets,
    background? : string,
    dateOfEvent? : string,
    dateOfRelease? : string,
    venue? : string,
    readable_event_name? : string,
    media? : any,
    location? : string,
    company? : string,
    position? : typeOfCenter,
    localDiscounts? : boolean,
    users? : Array<string>
}

const Create_Event_Main = ()=>{

    const [datas, setDatas]:[typeOfDatasParams, Function] = useState({});

    useEffect(()=>{
        if (window.location.pathname.split("/")[1] === "admin" && window.location.pathname.split("/")[2] === "rendezveny" && window.location.pathname.split("/")[3]){
            let id = window.location.pathname.split("/")[3];
            postData(`/get-event-data/${id}`, {token : ParseLocalStorage("long_token")})
            .then((d:any)=>{
                if (d && !d.datas){
                    setDatas(d);
                }
            })
        }
    }, []);


    return (window.location.pathname.split("/")[3] ? Object.keys(datas).length > 9 ? <EventSettings mediaDatas={datas && datas.media ? datas.media : ""} name = {datas && datas.name ? datas.name : ""} description = {datas && datas.description ? datas.description : ""} tickets_ = {datas && datas.tickets ? datas.tickets : []} background = {datas && datas.background ? datas.background : ""} dOfEvent = {datas && datas.dateOfEvent ? datas.dateOfEvent : ""} dOfRelease = {datas && datas.dateOfRelease ? datas.dateOfRelease : ""} venue = {datas && datas.venue ? datas.venue : ""} location = {datas && datas.location ? datas.location : ""} company={datas && datas.company ? datas.company : ""} markerPosition={datas && datas.position ? datas.position : {lat : 47.2367, lng : 16.621456}} localD = {datas && datas.localDiscounts ? datas.localDiscounts : false} usersList={datas && datas.users ? datas.users : []} /> : <div/>: <EventSettings />);
}

export default Create_Event_Main;