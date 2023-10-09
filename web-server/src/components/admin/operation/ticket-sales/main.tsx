import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import { useEffect, useState } from "react";
import TicketStats from "./tickets.component";
import Loader from "../../../loader/loader.component";
import { Pagination } from "antd";
import typeOfDatas from "./types/tableData";
import Search from "antd/es/input/Search";

type typeOfTicket = {
    name : string,
    price : number,
    unitPrice : number,
    amount : number,
    ticketId : string,
    places : Array<string>,
    eventId : string
}



const TicketSalesMain = ()=>{

    const [ticketDatas, setTicketDatas]:[Array<typeOfDatas> , Function] =  useState([]);
    const [page, setPage]:[number, Function] = useState(1);
    const [limit, setLimit]:[number, Function] = useState(10);
    const [maxSales, setMaxSales]:[number, Function] = useState(0);
    const [searchValue, setSearchValue]:[string, Function] = useState("");

    const getSales = ()=>{
        postData(`/ticket-sales?eventName=test&date=&page=${page}&limit=${limit}&search=${searchValue}`, {token : ParseLocalStorage("long_token")})
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
    }

    useEffect(()=>{
        getSales();
    }, [page, limit]);

    return (
        <div>
            <h1>Jegyeladások</h1>
            <div>
                <Search value={searchValue} onSearch={e=>getSales()} onChange={e=>setSearchValue(e.target.value)} className = "ticket-sales-search-field" />
                {ticketDatas.length ? <TicketStats datas = {ticketDatas} /> : <Loader />}
                {maxSales ? <Pagination defaultCurrent={page} pageSize={limit} total={maxSales} onChange={e=>setPage(e)} /> : ""}
            </div>
        </div>
    )
}

export default TicketSalesMain;