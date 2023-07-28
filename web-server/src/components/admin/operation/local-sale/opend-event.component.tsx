import postData from "../../../connection/request";
import { useEffect, useState } from "react";
import Error from "../../../notification/error.component";
import Notification from "../../../notification/notification.component";
import EventDetails from "./event-details.component";
import "../../../../css/local-sale-event.css"
import Tickets from "../../../event-page/tickets.component";
import Seats from "../../../event-page/seats.component";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import DiscountList from "./discountList.component";
import BuyButton from "../../../buy-button/buy-button.component";

type typeOfSeat = {
    group : string,
    id : string,
    name : string,
    posX : number,
    posY : number,
    title : string,
    ticketId? : string
}

type typeOfPlaces = {
    background : {isImage : boolean, name : "string"},
    colorOfBackground : string,
    colorOfSeat : string,
    seatsDatas : typeOfSeat,
    sizeOfArea : {width : number, height : number},
    sizeOfSeat : number
}

type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string
}

type typeOfEventDatas = {
    date : string,
    description : string,
    places : Array<typeOfPlaces>,
    tickets : Array<typeOfTicket>,
    title : string
}

type typeOfAmountTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    amount : number,
    selected : number,
    pendingPlaces : Array<string>,
    numberOfFreeTickets : number,
    boughtPlaces : Array<string>
}

type typeOfDiscount = {
    name : string,
    amount : number,
    money : boolean,
    _id : string
}

const Local_Sale_Event = ()=>{

    const genereateTicketAmout = (tickets:any):Array<typeOfAmountTicket>=>{
        let newList:Array<typeOfAmountTicket> = [];
        for (let i = 0; i < tickets.length; i++){
            newList.push({...tickets[i], amount : 0, selected : 0})
        }
        return newList;
    }

    const [eventDatas, setEventDatas]:[any, Function] = useState();
    const [error, setError] = useState("");
    const [amountTickets, setAmountTickets] = useState(genereateTicketAmout(eventDatas ? eventDatas.tickets : {}));
    const [selectedTickets, setSelectedTickets]:[Array<string>, Function] = useState([]);
    const [largeMap, setLargeMap]:[boolean, Function] = useState(false);
    const [discounts, setDiscounts]:[Array<typeOfDiscount>, Function] = useState([]);
    const [selectedDiscount,setSelectedDiscount]:[string, Function] = useState("");
    const [fullPrice, setPrice] = useState(0);

    const selectDiscount = (id:string)=>{
        if (selectedDiscount == id){
            setSelectedDiscount("");
        }
        else{
            setSelectedDiscount(id);
        }
    }

    const incrementAmountOfTickets = (id:String)=>{
        let l = [...amountTickets];
        for (let i = 0; i < l.length; i++){
            if (l[i].id === id && l[i].amount < l[i].numberOfTicket){
                l[i].amount++;
            }
        }
        let summ = 0;
        for (let i = 0; i < l.length; i++){
            summ += l[i].amount*l[i].price;
        }
        setPrice(summ);
        setAmountTickets(l);
    }

    console.log(amountTickets);

    const decrementAmountOfTickets = (id:string) => {
        let l = [...amountTickets];
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
        let summ = 0;
        for (let i = 0; i < l.length; i++){
            summ += l[i].amount*l[i].price;
        }
        setPrice(summ);
        setAmountTickets(l);
    }

    const getDiscounts = ()=>{
        postData("/get-local-discounts", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response.datas){
                setDiscounts(response.datas);
            }
            else{
                setError("Nem sikerült betölteni a kedvezményeket")
            }
        });
    }

    useEffect(()=>{
        let id = window.location.pathname.split("/")[3]
        fetch(`/api/v1/event/${id}`)
        .then(
            async (response:any)=>{
               response = await response.json();
               if (!response.error){
                setEventDatas(response);
                setAmountTickets(genereateTicketAmout(response.tickets));
               }else{
                setError(response.message ? response.message : "Nem sikerült betölteni az eseményt");
               }
            }
        );
        getDiscounts();
    }, []);

    const selectSeat = (id:string)=>{
        let lTicketAmount = [...amountTickets];
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
        setAmountTickets(lTicketAmount);
    }

    const buy = ()=>{
        
    }

    const getPrice = ()=>{
        for (let i = 0; i < discounts.length;i++){
            if (discounts[i]._id === selectedDiscount){
                return discounts[i].money ? fullPrice > discounts[i].amount ? fullPrice-discounts[i].amount : 0 : fullPrice-fullPrice*(discounts[i].amount/100);
            }
        }
        return fullPrice;
    }

    console.log(selectedDiscount);

    return (
            <div>
                {error ? <Notification element={<Error message={error} />} /> : ""}
                {eventDatas ? <EventDetails title = {eventDatas.title} description={eventDatas.description} image = {eventDatas.background} /> : ""}
                {eventDatas ? <Tickets tickets = {amountTickets} incrementFunction={incrementAmountOfTickets} decrementFunction={decrementAmountOfTickets} /> : ""}
                {eventDatas && eventDatas.places && eventDatas.places.seatsDatas.length ? <Seats places = {eventDatas.places}  tickets={amountTickets} seleted={selectedTickets} onClickFunction={selectSeat} /> : ""}
                {discounts.length ? <DiscountList discounts={discounts} onClikcFunction={selectDiscount} selectedDiscount={selectedDiscount} /> : ""}
                <div>Végösszeg: {getPrice()}Ft</div>
                <div className = "buy-btn-div"><BuyButton onClickFunction={buy} /></div>
            </div>
        );
}

export default Local_Sale_Event;