import { useState, useEffect } from "react";
import Loader from "../loader/loader.component";
import Details from "./buy-ticket-details.component";
import DatasOfCustomer from "./datas-of-customer.component";

type typeOfTicketDatas = {
    evetId : string, 
    tickets : Array<typeOfTickets>, 
    fullAmount : number, 
    fullPrice : number, 
    eventName : string, 
    dateOfEvent : number
}

type typeOfTickets = {
    name : string,
    places : Array<string> | boolean,
    amount : number,
    price : number
}

const BuyTicketMainPage = ()=>{

    const [ticketDatas, setTicketDatas]:[typeOfTicketDatas, Function] = useState({
        evetId : "", 
        tickets : [], 
        fullAmount : 0, 
        fullPrice : 0, 
        eventName : "", 
        dateOfEvent : 0
    });

    useEffect(()=>{
        let token = window.location.pathname.split("/")[2];
        fetch(`/buy-ticket-details/${token}`)
        .then(response=>response.json())
        .then(data=>setTicketDatas(data));
    }, []);

    return <div>
        <h1>Jegyvásárlás</h1>
        <h2>Áttekintés</h2>
        <div className = "details">
        {ticketDatas.evetId ? <Details tickets = {ticketDatas.tickets} fullPrice={ticketDatas.fullPrice} nameOfEvent={ticketDatas.eventName} /> : <Loader />}
        </div>
        <DatasOfCustomer />
    </div>
}

export default BuyTicketMainPage;