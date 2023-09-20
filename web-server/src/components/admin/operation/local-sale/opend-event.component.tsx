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
import postFile from "../../../connection/file";
import Success from "../../../notification/success.component";
import { DesktopOutlined, DisconnectOutlined, WifiOutlined } from "@ant-design/icons";
import socket from "../../../socket.io/socketio";
import Window from "../../../window/window.component";
import { Button, Empty } from "antd";
import MonitorList from "./monitorList.component";
import SocketIo from "../../../socket.io/socketio";
import SocketCommunication from "./socketCommunication";

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
    seats : Array<string>,
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

    const genereateTicketAmout = (tickets:any):Array<any>=>{
        let newList:Array<typeOfAmountTicket> = [];
        for (let i = 0; i < tickets.length; i++){
            newList.push({...tickets[i], amount : 0, selected : 0})
        }
        return newList;
    }



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

    const [eventDatas, setEventDatas]:[any, Function] = useState();
    const [venue, setVenue]:[any, Function] = useState();
    const [error, setError] = useState("");
    const [amountTickets, setAmountTickets]:[any, Function] = useState();
    const [selectedTickets, setSelectedTickets]:[Array<string>, Function] = useState([]);
    const [largeMap, setLargeMap]:[boolean, Function] = useState(false);
    const [discounts, setDiscounts]:[Array<typeOfDiscount>, Function] = useState([]);
    const [selectedDiscount,setSelectedDiscount]:[string, Function] = useState("");
    const [fullPrice, setPrice] = useState(0);
    const [succesfull, setSuccessfull]:[string, Function] = useState("");
    const [connectedToSocketMonitor, setConnectedToSocketMonitor] = useState(false);
    const [monitors, setMonitors] = useState([]);
    const [showMonitorsWindow,setShowMonitorsWindow] = useState(false);
    const [connectingToMonitor, setConnectingToMonitor] = useState(false);
    const [connectedId, setConnectedId]:[string, Function] = useState("");
    const [userSelecting, setUserSelecting]:[boolean, Function] = useState(false);

    useEffect(()=>{
        let id = window.location.pathname.split("/")[3]
        setSocketIO(SocketCommunication(socketIO));
        postData(`/event-datas/${id}`, {token : ParseLocalStorage("long_token")})
        .then(async (response)=>{
            if (!response.error){
                setEventDatas(response);
                //setAmountTickets(genereateTicketAmout(response.tickets));
                if (response.venue){
                    fetch(`/api/v1/venue/${response.venue}?event=${id}`).then(
                        async (response)=>{
                            let v =(await response.json());
                            if (v && !v.error){
                                setVenue(v.venue);
                            }
                        }
                    );
                }
                if (response.localDiscounts){
                    getDiscounts();
                }
            }
            else{
                response = response.responseDatas ? await response.responseDatas : response;
                response.message ? setError(response.message) : setError("Váratlan hiba történet az esemény betöltése közben")
            }
        })
        fetch(`/api/v1/tickets/${id}?reserved=true`)
        .then(async (response)=>{
            let tickets = await response.json();
            if (!tickets.error && tickets.length){
                setAmountTickets(genereateTicketAmout(tickets));
            }
        })
    }, []);

    useEffect(()=>{
        if (socketIO){
            socketIO.on("connection-status", (payload:any)=>{
                console.log(payload);
                if (payload.connected){
                    console.log(eventDatas);
                    if (payload.connectedMonitor && window.location.pathname.split("/")[3]){
                        socketIO.emit("display-event", {eventId : window.location.pathname.split("/")[3], token : ParseLocalStorage("long_token")});
                    }
                    setConnectedToSocketMonitor(true);
                    setConnectingToMonitor(false);
                    setConnectedId(payload.id)
                }
                else{
                    setConnectedToSocketMonitor(false); 
                    setError("A csatlakoztatott monitorral a kapocslat megszakadt.");
                    setConnectedId("");
                }
                });
            socketIO.on("event-display", (payload:any)=>{
                if (payload.error) setError(payload.message);
            });
            socketIO.on("tickets-sent", (payload:any)=>{
                if (payload.sent){
                    setUserSelecting(true);
                }
            }); 
        }
    }, [amountTickets, selectedTickets])

    console.log(amountTickets);

    const selectSeat = (id:string)=>{
        console.log(amountTickets);
        let lTicketAmount = [...amountTickets];
        let l:Array<string> = [];
        for (let i = 0; i < lTicketAmount.length; i++){
            if (lTicketAmount[i].seats.includes(id) && lTicketAmount[i].amount > lTicketAmount[i].selected && !selectedTickets.includes(id)){
                console.log(selectedTickets);
                l = [...selectedTickets, id];
                console.log(l);
                setSelectedTickets(l);
                lTicketAmount[i].selected++;
            }
            else if (selectedTickets.includes(id)){
                if (lTicketAmount[i].selected > 0){
                    lTicketAmount[i].selected--;
                }
                l = [...selectedTickets];
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
        //console.log(l.length ? l : selectedTickets);
        console.log(socketIO);
    }


    const getPlacesOfTicket = (places:Array<string>)=>{
        let selectedPlaces = [];
        for (let i = 0; i < places.length; i++){
            if (selectedTickets.includes(places[i])) selectedPlaces.push(places[i]);
        }
        return selectedPlaces.length ? selectedPlaces : false;
    }

    const controlAmountTickets = ()=>{
        let sendTickets = [];
        for (let i = 0; i < amountTickets.length; i++){
            if (amountTickets[i].amount > 0){
                sendTickets.push({amount : amountTickets[i].amount, name : amountTickets[i].name, ticketId : amountTickets[i].id, places : getPlacesOfTicket(amountTickets[i].seats)});
            }
        }
        return sendTickets;
    }

    const buy = async ()=>{
        socketIO.on("disconnect", () => {});
        let sendTickets = controlAmountTickets();
        postFile("/buy-local", {token : ParseLocalStorage("long_token"), datas : {
            eventId : window.location.pathname.split("/")[3],
            discount : selectedDiscount,
            tickets : sendTickets,
        }}, "/admin/helyi-eladas")
        .then((response:any)=>{
            if (response.error){
                setError(response.message);
            }
            else{
                setSuccessfull(response.message);
            }
        })
    }

    const getPrice = ()=>{
        for (let i = 0; i < discounts.length;i++){
            if (discounts[i]._id === selectedDiscount){
                return discounts[i].money ? fullPrice > discounts[i].amount ? fullPrice-discounts[i].amount : 0 : fullPrice-fullPrice*(discounts[i].amount/100);
            }
        }
        return fullPrice;
    }

    const getMonitors = ()=>{
        setShowMonitorsWindow(true)
        postData("/monitors", {token : ParseLocalStorage("long_token")})
        .then(
            response=>{
                if (!response.error && response.monitors){
                    setMonitors(response.monitors);
                }
            }
        )
    }

    const sendTicketDatas = ()=>{
        if (socketIO) socketIO.emit("tickets", {tickets : amountTickets, token : ParseLocalStorage("long_token"), eventId : window.location.pathname.split("/")[3]});
    }

    const closeTicketSelecting = ()=>{
        if (socketIO) socketIO.emit("stop-ticket-selecting", {token : ParseLocalStorage("long_token")});
    }

    const connectToMonitor = (id:string)=>{
        setConnectingToMonitor(true);
        socketIO.emit("join-to-monitor", {id : id, token : ParseLocalStorage("long_token")});
    }
    const [socketIO, setSocketIO]:[any, Function] = useState();

    return (
            <div>
                <Error message={error} setOpen={()=>{setError("")}} open = {error != ""}  />
                {succesfull ? <Notification element={<Success message={succesfull} />}/> : ""}
                { showMonitorsWindow ? <Window title="Monitorok" closeFunction={()=>{setShowMonitorsWindow(false)}} >{monitors.length ? <MonitorList disabledButtons = {!eventDatas && !eventDatas.id} connectedMonitor = {connectedId} loading = {connectingToMonitor} monitors = {monitors} onClickFunction ={connectToMonitor} /> : <Empty />}</Window> : showMonitorsWindow && !eventDatas ? <>{setError("Az oldal betöltése folyamatban van.")}</> : <></>}
                <span className = "connect-to-monitor-icon" onClick={e=>{getMonitors()}}><i className={`fas fa-wifi ${connectedToSocketMonitor ? "connected" : "disconnected"}`}></i></span>
                {eventDatas ? <EventDetails title = {eventDatas.title} description={eventDatas.description} image = {eventDatas.background} /> : ""}
                {eventDatas && amountTickets ? <Tickets tickets = {amountTickets} incrementFunction={incrementAmountOfTickets} decrementFunction={decrementAmountOfTickets} /> : ""}
                { userSelecting ? <Button icon = {<DisconnectOutlined />} onClick = {e=>closeTicketSelecting()} >Kiválasztás megszakítása</Button> : <Button onClick={e=>sendTicketDatas()} disabled = {!(connectedToSocketMonitor && connectedId && venue && venue.seatsDatas && venue.seatsDatas.length && controlAmountTickets().length)} icon = {<i className="fas fa-share"></i>} >Kiválasztás monitoron</Button>}
                {venue ? <Seats places = {venue}  tickets={amountTickets} seleted={selectedTickets} onClickFunction={selectSeat} /> : ""}
                {discounts.length ? <DiscountList discounts={discounts} onClikcFunction={selectDiscount} selectedDiscount={selectedDiscount} /> : ""}
                <div>Végösszeg: {getPrice()}Ft</div>
                <div className = "buy-btn-div"><BuyButton onClickFunction={buy} /></div>
            </div>
        );
}

export default Local_Sale_Event;