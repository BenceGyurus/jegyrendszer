import { useState } from "react";
import "../../../../css/ticket-stats.css";
import Table from "../../../table/table.component";
import CsvDownloadButton from 'react-json-to-csv';
import postFile from "../../../connection/file";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import TicketsTable from "./table.component";

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


type typeOfTicketStatsParams = {
    datas : Array<typeOfDatas>
}

const TicketStats = ({datas}:typeOfTicketStatsParams)=>{

    const [sortBy, setSortBy]:[string, Function] = useState("");
    const [reverse, setReverse]:[boolean, Function] = useState(false);
    const [filter, setFilter]:[Array<{key : any, filterWord : string, type : string, from : any, to : any}>, Function] = useState([]);
    const [selected, setSelected]:[string, Function] = useState("");

    const filterFunction = (value:any, key:string, type:string)=>{
        let l = [...filter];
        if (l.find(e=>e.key === key)) l.forEach((e,index)=>{if (e.key === key) l[index] = {key : key, filterWord : type != "date" ? value : "", type : type, from : type == "date" ? value.from : {}, to : type == "date" ? value.to : {}}});
        else l.push({key : key, filterWord : type != "date" ? value : "", type : type, from : type == "date" ? value.from : {}, to : type == "date" ? value.to : {}});
        setFilter(l);
    }

    console.log(filter);

    const getDate = ()=>{
        return new Date();
    }
    
    const sortDatas = ()=>{
        let s;
        let copy = [...datas];
        if (!sortBy) s = datas;
        s = datas.sort((a:any,b:any)=>{
            return reverse ? (a[sortBy] < b[sortBy]) ? 1 : (a[sortBy] > b[sortBy]) ? -1 : 0 : (a[sortBy] < b[sortBy]) ? -1 : (a[sortBy] > b[sortBy]) ? 1 : 0;
        });
        for (let i = 0; i < filter.length; i++){
            if (filter[i].filterWord || (filter[i].from && filter[i].to)){
                s = s.filter((l:any)=>{
                    if (filter[i].from || filter[i].to) console.log(new Date(l[filter[i].key]) >= new Date(`${filter[i].from.year}-${filter[i].from.month}-${filter[i].from.day}`) && new Date(l[filter[i].key]) <= new Date(`${filter[i].to.year}-${filter[i].to.month}-${filter[i].to.day}`));
                    return filter[i].type && filter[i].type == "boolean" ? "igen".includes(String(filter[i].filterWord).toLowerCase()) && l[filter[i].key] ? l[filter[i].key] : "nem".includes(String(filter[i].filterWord).toLowerCase()) && !l[filter[i].key] : filter[i].type == "date" ? new Date(l[filter[i].key]) >= new Date(`${filter[i].from.year}-${filter[i].from.month}-${filter[i].from.day}`) && new Date(l[filter[i].key]) <= new Date(`${filter[i].to.year}-${filter[i].to.month}-${filter[i].to.day} 23:59`) : String(l[filter[i].key]).toLowerCase().includes(filter[i].filterWord.toLowerCase())
                });
            }
        }
        datas = [...copy];
        return s;
    };

    const reverseFunction = (key:string)=>{
        if (key === sortBy)setReverse(!reverse)
    }

    const sortByFunction = (key:string)=>{
        if (key === sortBy) setSortBy("");
        else setSortBy(key);
    }

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