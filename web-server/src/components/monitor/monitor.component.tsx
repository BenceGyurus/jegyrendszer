//import { socket } from "../../../socketio/socket";
import { useEffect, useState } from "react";
import DefaultScreen from "./defaultScreen.component";
import { Button, Result } from 'antd';
import ConnectionStatus from "./connectionStatus.component";
import SelectName from "./selectName.component";
import socket from "../socket.io/socketio";
import EventPage from "./eventPage.component";
import DisplayVenue from "./displayVenue.component";
import "../../css/monitor.css";
import Ads from "../ads/ads.component";


const TicketMonitor = ()=>{

    const [connectionStatus, setConnectionStatus] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [ads, setAds] = useState(false);
    const [adsList, setAdsList] = useState([]);
    const [error403, setError403] = useState(false)
    const [connected, setConnected] = useState("");
    const [event, setEvent]:any = useState();
    const [venue, setVenue]:any = useState();
    const [tickets, setTickets]:any = useState();
    const [socketIO, setSocketIO]:any = useState();
    const [selected, setSelected]:[Array<string>, Function] = useState([]);

    const [topBackgroundColor, setTopBackgroundColor] = useState('transparent'); 
    const [bottomBackgroundColor, setBottomBackgroundColor] = useState('transparent'); 
    const [topBackgroundColorRight, setTopBackgroundColorRight] = useState('transparent'); 
    const [bottomBackgroundColorRight, setBottomBackgroundColorRight] = useState('transparent'); 
    

    const valueToHex = (c:number)=> {

        var hex = c.toString(16);
      
        return hex
      
      }

      const rgbToHex = (r:number, g:number, b:number) => {

        return(valueToHex(r) + valueToHex(g) + valueToHex(b));
      
      }

      function makeColorLighter(color:string, amount:number) {
        // Parse the RGB values from the color string
        const rgb = color.match(/\d+/g);
      
        if (rgb && rgb.length === 3) {
          // Convert RGB values to integers
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
      
          // Calculate the lighter color by adding the specified amount to each RGB component
          const lighterR = Math.min(r + amount, 255);
          const lighterG = Math.min(g + amount, 255);
          const lighterB = Math.min(b + amount, 255);
      
          // Return the lighter color as an "rgb(r, g, b)" string
          return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
        } else {
          // Invalid color format, return the original color
          return color;
        }
      }
      

      console.log(topBackgroundColor, topBackgroundColorRight);

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
                    setVenue(null);
                    setSelected([]);
                }
                else{
                    setError403(true);
                    setVenue(null);
                    setSelected([]);
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

            socketIo.on("amount-tickets", (payload)=>{
                if (!payload.error){
                    console.log(payload);
                    setVenue(payload);
                    if (payload.selected) setSelected(payload.selected);
                }
                else{
                    setError403(payload.message ? payload.message : "Váratlan hiba történet a terem betöltése közben");
                }
            })
            setSocketIO(socketIo);
        })
    }, []);

    useEffect(()=>{
        if (socketIO){
            socketIO.on("stop-ticket-selecting", (paylaod:any)=>{
            socketIO.emit("ticket-selecting-stopped", venue && venue.tickets ? {selected : selected, tickets : venue.tickets} : {});
            setSelected([]);
            setVenue(null);
        })}
    }, [selected, venue]);

    const selectSeat = (id:string)=>{
        let lTicketAmount = venue.tickets;
        let l:Array<string> = [];
        for (let i = 0; i < lTicketAmount.length; i++){
            if (lTicketAmount[i].seats.includes(id) && lTicketAmount[i].amount > lTicketAmount[i].selected && !selected.includes(id)){
                l = [...selected, id];
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

    const ready = ()=>{
        if (socketIO){
            socketIO.emit("ticket-selecting-stopped", venue && venue.tickets ? {selected : selected, tickets : venue.tickets} : {});
            setSelected([]);
            setVenue(null);
        }
    }

    const controlTickets = ()=>{
        let isFull = true;
        if (venue && venue.tickets && venue.tickets.length){
        for (let i = 0; i < venue.tickets.length; i++){
            isFull = venue.tickets[i].selected != venue.tickets[i].amount ? false : isFull;
        }
        }
        return isFull
    }


    controlTickets()
    //`linear-gradient(45deg, ${topBackgroundColor}, ${topBackgroundColorRight}, ${bottomBackgroundColor}, ${bottomBackgroundColorRight})`
    return <div className = "monitor-background">
        {!venue && event && event.background ? <div className = "monitor-background-animation">
        {event && event.background ? <img style={{width: window.innerWidth*2, height: window.innerWidth*3}} src = {event.background} className = "monitor-event-image-background" /> : ""}
        {event && event.background ? <img style={{width: window.innerWidth*2, height: window.innerWidth*3}} src = {event.background} className = "monitor-event-image-background-animated" /> : ""}
        </div> : ""}
        <ConnectionStatus connected = {connectionStatus} connecting = {connecting} />   
        {error403 ?  <Result status="403" title="403" subTitle="Hibás azonosítás" extra={<Button type="primary">Vissza főoldalra</Button>}/> : ""}
        {event && selected && venue ? <DisplayVenue venueId={venue.venueId} eventId={venue.eventId}aTickets={venue.tickets} selectEvent={selectSeat} selected={selected} /> : event && selected && !venue ? <EventPage event={event} />: ads  ? <></> : <Ads />}
        { venue ? <button onClick={e=>ready()} className = {`ready-button ${venue && venue.tickets && !controlTickets() ? " disabled-ready-button" : ""}`} disabled = {venue && venue.tickets && !controlTickets()} >Kész</button> : <></>} 
    </div>

}

/*
*/

export default TicketMonitor;