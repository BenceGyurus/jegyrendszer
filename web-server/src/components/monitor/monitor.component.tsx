//import { socket } from "../../../socketio/socket";
import { useEffect, useState } from "react";
import DefaultScreen from "./defaultScreen.component";
import { Button, Result } from 'antd';
import ConnectionStatus from "./connectionStatus.component";
import SelectName from "./selectName.component";
import socket from "../socket.io/socketio";
import EventPage from "./eventPage.component";
import DisplayVenue from "./displayVenue.component";

const TicketMonitor = ()=>{

    const [connectionStatus, setConnectionStatus] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [ads, setAds] = useState(false);
    const [adsList, setAdsList] = useState([]);
    const [error403, setError403] = useState(false)
    const [connected, setConnected] = useState("");
    const [event, setEvent]:any = useState();
    const [venue, setVenue]:any = useState();
    const [tickets, setTickets] = useState();
    const [socketIO, setSocketIO]:any = useState();
    const [selected, setSelected]:[Array<string>, Function] = useState([]);

    useEffect(()=>{
        const socketIo = socket();
        socketIo.on("connection", (socket:any)=>{
        });
        socketIo.emit("monitor-connection");
        setConnecting(true);
            socketIo.on("connection-status", (payload:any)=>{
                console.log(payload);
                if (!payload.error && payload.id && payload.connected){
                    setConnectionStatus(true);
                    setConnected(payload.id);
                }
                else if (!payload.connected){
                    setConnectionStatus(false);
                    setConnected("");
                }
                else{
                    setError403(true);
                }
                setConnecting(false);
            });
            socketIo.on("ads", (payload:any)=>{
                if (payload.adsList && payload.adsList.length){
                    setAds(payload.ads);
                    setAdsList(payload.adsList);
                }
            socketIo.on("event-display", (payload)=>{
                if (!payload.error){
                    //setTickets(payload.tickets);
                    //setSelected(payload.selected ? payload.selected : []);
                    fetch(`/api/v1/event/${payload.eventId}`)
                    .then(async (response:any)=>{
                        response = await response.json();
                        if (!response.error){
                            setEvent(response);
                        }
                    });
                    //console.log(payload.tickets, payload.selected);
                }
            })
            socketIo.on("disconnected-user", ()=>{
                setEvent("");
                setVenue(null);
            });

            socketIo.on("stop-ticket-selecting", (paylaod)=>{
                setVenue(null);
            })

            socketIo.on("amount-tickets", (payload)=>{
                if (!payload.error){
                    setVenue(payload);
                }
                else{
                    setError403(payload.message ? payload.message : "Váratlan hiba történet a terem betöltése közben");
                }
            })
            setSocketIO(socketIo);
        })
    }, []);

    const selectSeat = (id:string)=>{
        let lTicketAmount = venue.tickets;
        let l:Array<string> = [];
        for (let i = 0; i < lTicketAmount.length; i++){
            if (lTicketAmount[i].seats.includes(id) && lTicketAmount[i].amount > lTicketAmount[i].selected && !selected.includes(id)){
                l = [...selected, id];
                console.log(l);
                setSelected(l);
                lTicketAmount[i].selected++;
            }
            else if (selected.includes(id)){
                if (lTicketAmount[i].selected > 0){
                    lTicketAmount[i].selected--;
                }
                l = [...selected];
                let newList:Array<string> = [];
                l.forEach((element:string)=>{
                    if (element != id){
                        newList.push(element)
                    }
                })
                setSelected(newList);
            }
        }
        venue.tickets = (lTicketAmount);
        //console.log(l.length ? l : selectedTickets);
    }

    const getPlacesOfTicket = (places:Array<string>)=>{
        let selectedPlaces = [];
        for (let i = 0; i < places.length; i++){
            if (selected.includes(places[i])) selectedPlaces.push(places[i]);
        }
        return selectedPlaces.length ? selectedPlaces : false;
    }

    const controlTickets = ()=>{
        let sendTickets = [];
        for (let i = 0; i < venue.tickets.length; i++){
            if (venue.tickets[i].amount > 0){
                sendTickets.push({amount : venue.tickets[i].amount, name : venue.tickets[i].name, ticketId : venue.tickets[i].id, places : getPlacesOfTicket(venue.tickets[i].seats)});
            }
        }
        return sendTickets;
    }
    
    return <div>
        <ConnectionStatus connected = {connectionStatus} connecting = {connecting} />    
        {error403 ?  <Result status="403" title="403" subTitle="Hibás azonosítás" extra={<Button type="primary">Vissza főoldalra</Button>}/> : ""}
        {event && selected && venue ? <DisplayVenue venueId={venue.venueId} eventId={venue.eventId}aTickets={venue.tickets} selectEvent={selectSeat} selected={selected} /> : event && selected && !venue ? <EventPage event={event} />: ads  ? <></> : <DefaultScreen />}
        {venue && venue.tickets && controlTickets().length ? <Button>Kész</Button> : ""}
    </div>

}

export default TicketMonitor;