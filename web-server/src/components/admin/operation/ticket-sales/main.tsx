import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import { useEffect, useState } from "react";
import TicketStats from "./tickets.component";
import Loader from "../../../loader/loader.component";
import { Pagination } from "antd";

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
    eventId : string,
    buyId : string
}

const TicketSalesMain = ()=>{

    const [ticketDatas, setTicketDatas]:[Array<typeOfDatas> , Function] =  useState([]);
    const [page, setPage]:[number, Function] = useState(1);
    const [limit, setLimit]:[number, Function] = useState(10);
    const [maxSales, setMaxSales]:[number, Function] = useState(0);

    useEffect(()=>{
        postData(`/ticket-sales?eventName=test&date=&page=${page}&limit=${limit}`, {token : ParseLocalStorage("long_token")})
        .then(async (response)=>{
            if (response.responseData){
                response = await response.responseData;
            }
            else if(!response.error){
                setTicketDatas(response.sales);
                setMaxSales(response.max);
            }
        }
        );
    }, [page, limit]);

    console.log(ticketDatas);

    return (
        <div>
            <h1>Jegyeladások</h1>
            <div>
                {ticketDatas.length ? <TicketStats datas = {ticketDatas} /> : <Loader />}
                {maxSales ? <Pagination defaultCurrent={page} pageSize={limit} total={maxSales} onChange={e=>setPage(e)} /> : ""}
            </div>
        </div>
    )
}

export default TicketSalesMain;