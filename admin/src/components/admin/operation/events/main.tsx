import { useState, useEffect } from "react";
import EventSettings from "./components/event_Settings.component";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import postData from "../../../connection/request";
import 'react-tooltip/dist/react-tooltip.css'


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
    users? : Array<string>,
    contributors? : Array<string>,
    address? : string,
    gate_Opening? : string,
    end_Of_The_Event? : string,
    wardrobe? : boolean,
    versions? : Array<{username : string, date : "string"}>,
    performer? : string,
    isGroupPerformer? : boolean
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


    return (window.location.pathname.split("/")[3] ? Object.keys(datas).length > 9 ? <EventSettings performerIn={datas && datas.performer ? datas.performer : ""} isGroupPerformerIn = {datas && datas.isGroupPerformer ? datas.isGroupPerformer : false} mediaDatas={datas && datas.media ? datas.media : ""} name = {datas && datas.name ? datas.name : ""} description = {datas && datas.description ? datas.description : ""} tickets_ = {datas && datas.tickets ? datas.tickets : []} background = {datas && datas.background ? datas.background : ""} dOfEvent = {datas && datas.dateOfEvent ? datas.dateOfEvent : ""} dOfRelease = {datas && datas.dateOfRelease ? datas.dateOfRelease : ""} venue = {datas && datas.venue ? datas.venue : ""} location = {datas && datas.location ? datas.location : ""} company={datas && datas.company ? datas.company : ""} markerPosition={datas && datas.position ? datas.position : {lat : 47.2367, lng : 16.621456}} localD = {datas && datas.localDiscounts ? datas.localDiscounts : false} usersList={datas && datas.users ? datas.users : []} contributors = {datas && datas.contributors ? datas.contributors : []} addre={datas && datas.address ? datas.address : ""} open={datas && datas.gate_Opening ? datas.gate_Opening : ""} end={datas && datas.end_Of_The_Event ? datas.end_Of_The_Event : ""} isWardrobe = {datas && datas.wardrobe ? datas.wardrobe : false} versions = {datas && datas.versions ? datas.versions : [] } readable_event_name={datas && datas.readable_event_name ? datas.readable_event_name : ""} /> : <div/>: <EventSettings />);
}

export default Create_Event_Main;