import { useState } from "react";
import TicketPageItems from "./page-items";
import Tickets from "./tickets.component";
import Seats from "./seats.component";
import BuyButton from "./buy-button.component";
import "../../css/buy-ticket-page.css";
import Error from "../notification/error.component";
import postData from "../connection/request";
import Notification from "../notification/notification.component";

type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string,
    ticketId : string,
}

type typeOfAmountTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number
}

type typeOfPageParams = {
    title : string,
    background : string,
    description : string,
    date : string,
    id : string,
    tickets : Array<typeOfTicket>,
    placeDatas : typeOfPlaces
}
type typeOfAmount = {
    id : string,
    amount : number
}

type typeOfSeat = {
    group : string,
    id : string,
    name : string,
    posX : number,
    posY : number,
    title : string
}

type typeOfPlaces = {
    background : {isImage : boolean, name : "string"},
    colorOfBackground : string,
    colorOfSeat : string,
    seatsDatas : Array<typeOfSeat>,
    sizeOfArea : {width : number, height : number},
    sizeOfSeat : number,
    stage : number
}

const Page = ({title, background, description, date, id, tickets, placeDatas}:typeOfPageParams)=>{

    const genereateTicketAmout = (tickets:Array<typeOfTicket>):Array<typeOfAmountTicket>=>{
        let newList:Array<typeOfAmountTicket> = [];
        for (let i = 0; i < tickets.length; i++){
            newList.push({...tickets[i], amount : 0, selected : 0})
        }
        return newList;
    }

    const [ticketsAmount, setTicketsAmount]:[Array<typeOfAmountTicket>, Function] = useState(genereateTicketAmout(tickets))
    const [selectedTickets, setSelectedTickets]:[Array<string>, Function] = useState([]);
    const [errorNat, setErrorNat]:[string, Function] = useState("");

    const incrementAmountOfTickets = (id:String)=>{
        let l = [...ticketsAmount];
        for (let i = 0; i < l.length; i++){
            if (l[i].id === id && l[i].amount < l[i].numberOfTicket){
                l[i].amount++;
            }
        }
        setTicketsAmount(l);
    }

    const decrementAmountOfTickets = (id:string) => {
        let l = [...ticketsAmount];
        let newList:Array<string> = [];
        for (let i = 0; i < l.length; i++){
            if (l[i].id === id && l[i].amount > 0){
                l[i].amount--;
                if (l[i].selected > 0){
                    l[i].selected--;
                }
                let deleted = false;
                if (l[i].selected >= l[i].amount){
                let lamdba = [...selectedTickets];
                for (let j = lamdba.length-1; j >= 0; j--){
                    if (!l[i].places.includes(lamdba[j]) || deleted){
                        newList.push(lamdba[j]);
                    }
                    if (l[i].places.includes(lamdba[j])){
                        deleted = true;
                    }
                }
                setSelectedTickets(newList);
                }
            }
        }
        setTicketsAmount(l);
    }

    const selectSeat = (id:string)=>{
        let lTicketAmount = [...ticketsAmount];
        for (let i = 0; i < lTicketAmount.length; i++){
            if (lTicketAmount[i].places.includes(id) && lTicketAmount[i].amount > lTicketAmount[i].selected && !selectedTickets.includes(id)){
                let l = [...selectedTickets, id];
                setSelectedTickets(l);
                lTicketAmount[i].selected++;
            }
            else if (selectedTickets.includes(id)){
                if (lTicketAmount[i].selected > 0){
                    lTicketAmount[i].selected--;
                }
                let l = [...selectedTickets];
                let newList:Array<string> = [];
                l.forEach((element:string)=>{
                    if (element != id){
                        newList.push(element)
                    }
                })
                setSelectedTickets(newList);
            }
        }
        setTicketsAmount(lTicketAmount);
    }

    const buy_Ticket = ()=>{
        let sendData = [];
        let error = [];
        let control = false;
        for (let i = 0; i < ticketsAmount.length; i++){
            if (ticketsAmount[i].amount > 0){
                control = true;
                if (!ticketsAmount[i].places.length && ticketsAmount[i].numberOfTicket > 0){
                    sendData.push({amount : ticketsAmount[i].amount, ticketId : ticketsAmount[i].id, places : false, eventId : id})
                }
                else if (ticketsAmount[i].numberOfTicket > 0 && ticketsAmount[i].places.length){
                    let selected = [];
                    for (let j = 0; j < selectedTickets.length; j++){
                        if (ticketsAmount[i].places.includes(selectedTickets[j])){
                            selected.push(selectedTickets[j]);
                        }
                    }
                    if (selected.length != ticketsAmount[i].amount){
                        error.push("Kérem válassza ki a helyeket");
                    }
                    else{
                        sendData.push({amount : ticketsAmount[i].amount, ticketId : ticketsAmount[i].id, places : selected, eventId : id});
                    }
                }
            }
        }
        if (!control){
            error.push("Kérem adja meg a vásárolni kívánt mennyiséget!");
        }
        if (!error.length){
            postData("/order-ticket", {datas : sendData, eventId : id})
            .then(response=>{
                if (response.error && response.message){
                    setErrorNat(response.message);
                }
                else if (!response.error && response.token){
                    window.location.pathname = `/jegyvasarlas/${response.token}`;
                }
            });
            return
        }
        if (!error.length){
            error.push("Hiba történet az oldal betöltése közben");
        }
        setErrorNat(error[0]);
    }

    return <div className="event-page-div">
        {errorNat ? <Notification element={<Error message={errorNat} closeFunction={()=>{setErrorNat("")}} />} /> : ""}
        <TicketPageItems title = {title} image = {background} description={description} date = {date}/>
        <Tickets tickets={ticketsAmount} incrementFunction={incrementAmountOfTickets} decrementFunction={decrementAmountOfTickets}/>
        {placeDatas.seatsDatas.length ? <Seats places={placeDatas} tickets={ticketsAmount} seleted={selectedTickets} onClickFunction = {selectSeat} /> : ""}
        <BuyButton onClickFunction={buy_Ticket} />
    </div>;
}

export default Page;