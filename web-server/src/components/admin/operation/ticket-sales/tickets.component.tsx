import ProgressBar from "../../../progress/progress.component";
import { useState } from "react";
import "../../../../css/ticket-stats.css";

type typeOfTicket = {
    amount : number,
    name : string,
    places : Array<any> | boolean,
    price : number,
    ticketId : string
}

type typeOfDatas = {
    date : number,
    fullPrice : number,
    amount : number,
    bought : boolean,
    tickets : Array<typeOfTicket>
}

type typeOfTicketDatas = {
    id : string,
    eventName : string,
    image : string,
    datas : Array<typeOfDatas>,
    numberOfTickets : number
}

type typeOfTicketStatsParams = {
    datas : Array<typeOfTicketDatas>
}

const TicketStats = ({datas}:typeOfTicketStatsParams)=>{

    const [colors, setColors] = useState(["#ff3d3d", "#a8ff75", "#75c8ff", "#df7dfa", "#fa7d9a", "#f8ffa8", "#a8f6ff"]);

    const calcDatas = (datas:Array<typeOfDatas>)=>{
        let amountOfPendingTickets = 0;
        let amountOfSoldTickets = 0;
        let soldPrice = 0;
        datas.forEach((element) => {
            if (element.bought){
                amountOfSoldTickets+=element.amount;
                soldPrice += element.fullPrice
            }
            else{
                amountOfPendingTickets+=element.amount
            }
            });
        return {pending : amountOfPendingTickets, sold : amountOfSoldTickets, fullIncome : soldPrice};
    }

    const getArrayToProgressBar:any = (datas:Array<typeOfDatas>)=>{
        let returnDatas:Array<{name : string, amount : number, id : string, backgroundColor : string}> = [];
        let l:any = {};
        datas.forEach((element)=>{
            if (element.bought){
                element.tickets.forEach((ticket)=>{
                    l[ticket.ticketId] ? l[ticket.ticketId].amount += ticket.amount : l[ticket.ticketId] = {name : ticket.name, amount : ticket.amount}
                })
            }
        })
       Object.keys(l).forEach((element, index)=>{
        if (index < colors.length){
            returnDatas.push({name : l[element].name, amount : l[element].amount, id : element, backgroundColor : colors[index]});
        }
       });
       return returnDatas
    }   


    return (
        <div>
            {datas.map((element, index)=>{
                //console.log(getArrayToProgressBar(element.datas));
                let statistics = calcDatas(element.datas);
                return (
                    <div className = "event-stat-main-div">
                        <img className = "event-stat-image" src={element.image} alt={`${element.eventName} esemény borítóképe`} />
                        <h2>{element.eventName}</h2>
                        <h3>Eddigi összes bevétel: {statistics.fullIncome}</h3>
                        <h3>Összes eladott jegy száma: {statistics.sold}</h3>
                        <h3>Függőben lévő jegyek száma: {statistics.pending}</h3>
                        <div className = "progress"><ProgressBar full={element.numberOfTickets} listOfBars={[{name: "Eladaott jegyek", amount:statistics.sold, backgroundColor:"green", id : `sold-bar-${index+1}`},{name : "Jelenleg foglalt jegyek" ,amount:statistics.pending, backgroundColor:"yellow", id : `pending-bar-${index+1}`}]}/></div>
                        <div className = "progress"><ProgressBar full={statistics.sold} listOfBars={getArrayToProgressBar(element.datas)} width={200} /></div>
                    </div>
                );
            })}
        </div>
    );
}

export default TicketStats;