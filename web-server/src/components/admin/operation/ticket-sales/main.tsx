import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import { useEffect, useState } from "react";
import TicketStats from "./tickets.component";
import Loader from "../../../loader/loader.component";

type typeOfDatas = {
    date : number,
    fullPrice : number,
    amount : number,
    bought : boolean,
    tickets : Array<any>
}

type typeOfTicketDatas = {
    id : string,
    eventName : string,
    image : string,
    datas : Array<typeOfDatas>,
    numberOfTickets : number
}

const TicketSalesMain = ()=>{

    const [ticketDatas, setTicketDatas]:[Array<typeOfTicketDatas> , Function] =  useState([]);

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

export default TicketSalesMain