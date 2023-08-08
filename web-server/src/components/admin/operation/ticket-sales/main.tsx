import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import { useEffect, useState } from "react";
import TicketStats from "./tickets.component";
import Loader from "../../../loader/loader.component";

type typeOfTicket = {
    name : string,
    price : number,
    unitPrice : number,
    amount : number,
    ticketId : string,
    places : Array<string>,
    eventId : string
}


type typeOfDatas = {
    user : string, 
    coupon : string, 
    price : number, 
    local : boolean, 
    tickets : Array<typeOfTicket>,
    date : string, 
    fullPrice : number, 
    eventName : string, 
    eventId : string
}

const TicketSalesMain = ()=>{

    const [ticketDatas, setTicketDatas]:[Array<typeOfDatas> , Function] =  useState([]);

    useEffect(()=>{
        postData("/ticket-sales", {token : ParseLocalStorage("long_token")})
        .then(async (response)=>{
            if (response.responseData){
                response = await response.responseData;
            }
            else if(!response.error){
                setTicketDatas(response);
            }
        }
        );
    }, []);

    console.log(ticketDatas);

    return (
        <div>
            <h1>Jegyeladások</h1>
            <div>
                {ticketDatas.length ? <TicketStats datas = {ticketDatas} /> : <Loader />}
            </div>
        </div>
    )
}

export default TicketSalesMain;