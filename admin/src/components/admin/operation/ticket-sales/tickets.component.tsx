import { useState } from "react";
import "../../../../css/ticket-stats.css";
import Table from "../../../table/table.component";
import CsvDownloadButton from 'react-json-to-csv';
import postFile from "../../../connection/file";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import TicketsTable from "./table.component";
import typeOfTicket from "./types/ticket";
import typeOfDatas from "./types/tableData";


type typeOfTicketStatsParams = {
    datas : Array<typeOfDatas>
}

const TicketStats = ({datas}:typeOfTicketStatsParams)=>{

    const printFunction = (id:string)=>{
        console.log(id);
        postFile(`/print-ticket/${id}`, {token : ParseLocalStorage("long_token")})
        .then(response=>{
            console.log(response);
        })
    }

    const deleteFunction = (id:string)=>{

    }

    return (
        <TicketsTable tickets={datas} printFunction={printFunction} deleteFunction={deleteFunction}/>
    )
    
}

//<CsvDownloadButton style={{border : "none"}} className = "add-new-user-button" data={datas} filename = "jegyeladasok.csv"><i className="fas fa-cloud-download-alt"></i> Letöltés (.CSV)</CsvDownloadButton>

//<Table printFunction = {printFunction} datas={sortDatas()} columns={[{title : "Esemény neve", key : "eventName"}, {title : "Vásárlás ideje", key : "date", type : "date"}, {title : "Kupon", key : "coupon"}, {title :"Eladó", key : "user"}, {title :"Ár", key : "price"}, {title :"Teljes ár", key : "fullPrice"}, {title : "Mennyiség", key : "fullAmount"}, {title : "Jegyiroda", key : "local", type : "boolean"}]} sortFunction={sortByFunction} reverseFunction={reverseFunction} onChangeFunction={filterFunction} sortedBy={sortBy} reverse = {reverse} selectedId={selected} selectFunction={setSelected} filter={filter}/>

export default TicketStats;