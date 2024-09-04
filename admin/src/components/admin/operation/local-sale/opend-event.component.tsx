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
import { DisconnectOutlined } from "@ant-design/icons";
import Window from "../../../window/window.component";
import { Button, Empty, Spin } from "antd";
import MonitorList from "./monitorList.component";
import SocketCommunication from "./socketCommunication";
import { GiftTwoTone } from "@ant-design/icons";

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

type typeOfAmountTicketType = {
    name : string,
    price : number,
    id : string,
    amount : number
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
    boughtPlaces : Array<string>,
    _id : string,
    type : typeOfAmountTicketType
}

type typeOfDiscount = {
    name : string,
    amount : number,
    money : boolean,
    _id : string
}

const sumAmountOfAllTypes = (types:Array<typeOfAmountTicketType>)=>{
    let sum = 0;
    types.forEach(type=>{
      sum += type.amount;
    });
    return sum
  };

const Local_Sale_Event = ()=>{

    const genereateTicketAmout = (tickets:any):Array<any>=>{
    
        let newList:Array<typeOfAmountTicket> = [];
        for (let i = 0; i < tickets.length; i++) {
            tickets[i].types = tickets[i].types.map((type:any)=> {return {...type, amount : 0}});
            tickets[i].selected = 0;
            newList.push({ ...tickets[i]});
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

    const incrementAmountOfTickets = (id:String, typeId:string)=>{
        if (!userSelecting){
            let l = [...amountTickets];
            for (let i = 0; i < l.length; i++) {
              if (l[i].id === id && sumAmountOfAllTypes(l[i].types) < l[i].numberOfFreeTickets) {
                let thisType = l[i].types.find((k:typeOfAmountTicketType)=>k.id==typeId);
                thisType.amount++;
                l[i].types = [...l[i].types.filter((type:typeOfAmountTicketType)=> type.id != typeId), thisType];
              }
            }
            //setPrice()
            setAmountTickets(l);
    }
    else{
        setError("A jegyek mennyiségének változtatásához szakítsa meg a külső kiválasztást.");
    }
    }


    const decrementAmountOfTickets = (id:string, typeId:string) => {
        if (!userSelecting){
            let l = [...amountTickets];
            let newList: Array<string> = [];
            for (let i = 0; i < l.length; i++) {
              if (l[i].id === id && sumAmountOfAllTypes(l[i].types) > 0) {
                let thisType = l[i].types.find((k:typeOfAmountTicketType)=>k.id==typeId);
                thisType.amount--;
                l[i].types = [...l[i].types.filter((type:typeOfAmountTicketType)=> type.id != typeId), thisType];
                let deleted = false;
                if (l[i].selected >= sumAmountOfAllTypes(l[i].types)) {
                  l[i].selected--;
                  let lamdba = [...selectedTickets];
                  for (let j = lamdba.length - 1; j >= 0; j--) {
                    if (!l[i].seats.includes(lamdba[j]) || deleted) {
                      newList.push(lamdba[j]);
                    }
                    if (l[i].seats.includes(lamdba[j])) {
                      deleted = true;
                    }
                  }
                  setSelectedTickets(newList);
                }
              }
            }
            setAmountTickets(l);
        }
        else{
            setError("A jegyek mennyiségének változtatásához szakítsa meg a külső kiválasztást.")
        }
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
    const [buying, setBuying] = useState(false);

    console.log(amountTickets);

    useEffect(()=>{
        const url = new URL(window.location.href);
        let id = url.pathname.split("/")[3]
        console.log(id);
        setSocketIO(SocketCommunication(socketIO));
        postData(`/event-datas/${id}`, {token : ParseLocalStorage("long_token")})
        .then(async (response)=>{
            if (!response.error){
                setEventDatas(response);
                //setAmountTickets(genereateTicketAmout(response.tickets));
                if (response.venue){
                    postData(`/venue-details/${response.venue}?event=${id}`, {token : ParseLocalStorage("long_token")}).then(
                        async (v)=>{
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
        postData(`/tickets/${id}?reserved=true`, {token : ParseLocalStorage("long_token")})
        .then(async (tickets)=>{
            if (!tickets.error && tickets.length){
                setAmountTickets(genereateTicketAmout(tickets));
            }
        })
    }, []);

    useEffect(()=>{
        if (socketIO){
            socketIO.on("connection-status", (payload:any)=>{
                console.log(payload, eventDatas);
                if (payload.connected && eventDatas?._id){
                    if (payload.connectedMonitor && window.location.pathname.split("/")[3]){
                        socketIO.emit("display-event", {eventId : eventDatas._id, token : ParseLocalStorage("long_token")});
                    }
                    setConnectedToSocketMonitor(true);
                    setConnectingToMonitor(false);
                    setConnectedId(payload.id)
                }
                else{
                    setConnectedToSocketMonitor(false); 
                    setError("A csatlakoztatott monitorral a kapocslat megszakadt.");
                    setConnectedId("");
                    setUserSelecting(false);
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
            socketIO.on("stop-ticket-selecting", (payload:any)=>{
                if (payload.selected) setSelectedTickets(payload.selected);
                if (payload.tickets) setAmountTickets(payload.tickets)
                setUserSelecting(false);
            })
        }
    }, [amountTickets, selectedTickets, selectedTickets, eventDatas])


    const selectSeat = (id:string)=>{
        let lTicketAmount = [...amountTickets];
        for (let i = 0; i < lTicketAmount.length; i++) {
          if (
            lTicketAmount[i].seats.includes(id) &&
            sumAmountOfAllTypes(lTicketAmount[i].types) > lTicketAmount[i].selected &&
            !selectedTickets.includes(id)
          ) {
            let l = [...selectedTickets, id];
            setSelectedTickets(l);
            lTicketAmount[i].selected++;
          } else if (
            lTicketAmount[i].seats.includes(id) &&
            selectedTickets.includes(id)
          ) {
            if (lTicketAmount[i].selected > 0) {
              lTicketAmount[i].selected--;
            }
            let l = [...selectedTickets];
            let newList: Array<string> = [];
            newList = l.filter((item) => item != id);
            setSelectedTickets(newList);
          }
        }
        setAmountTickets(lTicketAmount);
    }

    console.log(selectedTickets);

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
            if (sumAmountOfAllTypes(amountTickets[i].types) > 0){
                sendTickets.push({amount : sumAmountOfAllTypes(amountTickets[i].types), name : amountTickets[i].name, ticketId : amountTickets[i].id, places : getPlacesOfTicket(amountTickets[i].seats), types : amountTickets[i].types.filter((type:any)=>{return type.amount > 0})});
            }
        }
        return sendTickets;
    }

    const buy = async (invitation:boolean | undefined)=>{
        if (!userSelecting){
            setBuying(true)
            socketIO.on("disconnect", () => {});
            let sendTickets = controlAmountTickets();
            postFile("/buy-local", {token : ParseLocalStorage("long_token"), datas : {
                eventId : eventDatas.id,
                discount : selectedDiscount,
                tickets : sendTickets,
                invitation : !!invitation
            }}, "/admin/helyi-eladas")
            .then((response:any)=>{
                setBuying(false);
                if (response.error){
                    setError(response.message);
                }
                else{
                    setSuccessfull(response.message);
                }
        })
    }
    }

    const getPrice = ()=>{
        for (let i = 0; i < discounts.length;i++){
            if (discounts[i]._id === selectedDiscount){
                return Math.round(discounts[i].money ? fullPrice > discounts[i].amount ? fullPrice-discounts[i].amount : 0 : fullPrice-fullPrice*(discounts[i].amount/100));
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
        if (socketIO) socketIO.emit("tickets", { selected : selectedTickets ,tickets : amountTickets, token : ParseLocalStorage("long_token"), eventId : window.location.pathname.split("/")[3]});
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
                {eventDatas && amountTickets ? <Spin tip="Helyek kiválasztása folyamatban..." spinning = {userSelecting}><Tickets tickets = {amountTickets} incrementFunction={incrementAmountOfTickets} decrementFunction={decrementAmountOfTickets} /></Spin> : ""}
                { venue && venue?.seats.length ? userSelecting ? <Button className = "user-select-button" icon = {<DisconnectOutlined />} onClick = {e=>closeTicketSelecting()} >Kiválasztás megszakítása</Button> : <Button className = "user-select-button" onClick={e=>sendTicketDatas()} disabled = {!(connectedToSocketMonitor && connectedId && venue && venue.seats && venue.seats.length && controlAmountTickets().length)} icon = {<i className="fas fa-share"></i>} >Kiválasztás monitoron</Button> : <></>}
                {venue && venue?.seats.length ? <Seats disabled = {userSelecting} places = {venue}  tickets={amountTickets} seleted={selectedTickets} onClickFunction={selectSeat} /> : ""}
                {discounts.length ? <DiscountList discounts={discounts} onClikcFunction={selectDiscount} selectedDiscount={selectedDiscount} /> : ""}
                <div>Végösszeg: {getPrice().toLocaleString('hu-HU', { useGrouping: true, minimumFractionDigits: 0 })}Ft {discounts.length && selectedDiscount ? <span>(<span className = "discount-price">{`- ${(fullPrice-getPrice()).toLocaleString('hu-HU', { useGrouping: true, minimumFractionDigits: 0 })} Ft`}</span>)</span> : ""}</div>
                <div className = "buy-btn-div"><Button loading = {buying} disabled = {userSelecting} icon = {<GiftTwoTone />}  onClick={()=>buy(true)}>Meghívó nyomtatása</Button></div>
                <div className = "buy-btn-div"><BuyButton disabled = {userSelecting} onClickFunction={buy} /></div>
            </div>
        );
}

export default Local_Sale_Event;