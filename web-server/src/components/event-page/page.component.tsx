import { useEffect, useState } from "react";
import TicketPageItems from "./page-items";
import Tickets from "./tickets.component";
import Seats from "./seats.component";
import BuyButton from "./buy-button.component";
import "../../css/buy-ticket-page.css";
import Error from "../notification/error.component";
import postData from "../connection/request";
import Notification from "../notification/notification.component";
import Loader from "../loader/loader.component";
import TicketSkeleton from "./ticket-skeleton.component";
import Legend from "./legend.component";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

type typeOfTicket = {
    id : string,
    numberOfTicket : number,
    places : Array<string>,
    price : number,
    name : string,
    ticketId : string,
    pendingPlaces : Array<string>,
    numberOfFreeTickets : number,
    boughtPlaces : Array<string>
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

type typeOfPageParams = {
    title : string,
    background : string,
    description : string,
    date : string,
    id : string,
    placeDatas : typeOfPlaces,
    media : typeOfMedia,
    location : string,
    position : typeOfCenter,
    address : string,
    ticketId : string,
    venueId : string
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
type typeOfMedia = {
    apple_music? : string,
    spotify? : string,
    youtube? : string,
    facebook? : string,
    instagram? : string

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
type typeOfCenter = {
    lat : number,
    lng : number
}

const Page = ({title, background, description, date, id, media, position, location, address, ticketId, venueId}:typeOfPageParams)=>{



    const genereateTicketAmout = (tickets:Array<typeOfTicket>):Array<typeOfAmountTicket>=>{
        let newList:Array<typeOfAmountTicket> = [];
        for (let i = 0; i < tickets.length; i++){
            newList.push({...tickets[i], amount : 0, selected : 0})
        }
        return newList;
    }
    //const [tickets, setTickets]:[typeOfTicket, Function] = useState();
    const [placeDatas, setPlaceDatas]:[any, Function] = useState([]);
    const [ticketsAmount, setTicketsAmount]:[Array<any>, Function] = useState([])
    const [selectedTickets, setSelectedTickets]:[Array<string>, Function] = useState([]);
    const [errorNat, setErrorNat]:[string, Function] = useState("");
    const [selectNotification, setSelectNotification] = useState(false);


    useEffect(()=>{
        fetch(`/api/v1/tickets/${ticketId}?reserved=true`)
        .then(async (response)=>{
            let t = await response.json();
            if (t.length && !t.error){
                setTicketsAmount(genereateTicketAmout(t));
            }
        });
        fetch(`/api/v1/venue/${venueId}?event=${ticketId}`)
        .then(
            async(response)=>{
                let venue = await response.json();
                if (!venue.error && venue)
                {      
                    setPlaceDatas(venue.venue);
                }
            }
        )
    },[]);


    const incrementAmountOfTickets = (id:String)=>{
        setSelectNotification(true);
        let l = [...ticketsAmount];
        for (let i = 0; i < l.length; i++){
            console.log(l[i].numberOfFreeTickets, l[i].amount);
            if (l[i].id === id && l[i].numberOfFreeTickets > l[i].amount){
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
                    if (!l[i].seats.includes(lamdba[j]) || deleted){
                        newList.push(lamdba[j]);
                    }
                    if (l[i].seats.includes(lamdba[j])){
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
        setSelectNotification(false);
        let lTicketAmount = [...ticketsAmount];
        for (let i = 0; i < lTicketAmount.length; i++){
            if (lTicketAmount[i].seats.includes(id) && lTicketAmount[i].amount > lTicketAmount[i].selected && !selectedTickets.includes(id)){
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
                if (!ticketsAmount[i].seats.length && ticketsAmount[i].numberOfTicket > 0){
                    sendData.push({amount : ticketsAmount[i].amount, ticketId : ticketsAmount[i].id, places : false, eventId : id})
                }
                else if (ticketsAmount[i].numberOfTicket > 0 && ticketsAmount[i].seats.length){
                    let selected = [];
                    for (let j = 0; j < selectedTickets.length; j++){
                        if (ticketsAmount[i].seats.includes(selectedTickets[j])){
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
            .then(async (response)=>{
                console.log(response)
                if (response.responseData){
                    response = await response.responseData
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
        <Error message={errorNat} open = {errorNat!=""} setOpen={()=>setErrorNat("")} />
        <TicketPageItems title = {title} image = {background} description={description} date = {date} media={media} position={position} location={location} address={address}/>
        {ticketsAmount && ticketsAmount.length ? <Tickets tickets={ticketsAmount} incrementFunction={incrementAmountOfTickets} decrementFunction={decrementAmountOfTickets}/> : <TicketSkeleton />}
        {placeDatas && placeDatas.seatsDatas && placeDatas.seatsDatas.length ? <Legend /> : ""}
        {placeDatas && placeDatas.seatsDatas && placeDatas.seatsDatas.length && ticketsAmount && ticketsAmount.length ? <Seats places={placeDatas} tickets={ticketsAmount} seleted={selectedTickets} onClickFunction = {selectSeat} /> : ""}
        <div className = "alert-notification"><Collapse in={selectNotification}>
        <Alert
            severity = "info"
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setSelectNotification(false);
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            sx={{ mb: 2 }}
            >
          Válassza ki a helyeket a jegy tükrön!
        </Alert>
      </Collapse></div>
        <BuyButton onClickFunction={buy_Ticket} />
    </div>;
}
export default Page;