import { useEffect, useState } from "react";
import SeatVisualization from "../seat-visualization-engine/seats.component";
import "../../css/monitor-tickets.css";

type typeOfDisplayVenueParams = {
    venueId : string,
    eventId : string,
    aTickets : any,
    selectEvent : Function,
    selected : Array<string>
};

const getSizeOfStage = (type:number, sizeOfArea:{width : number, height : number})=>{
    return {
        width : type == 1 || type == 4 ? sizeOfArea.width * 0.3 : 50,
        height : type == 2 || type == 3 ? sizeOfArea.height * 0.3 : 50,
        x : type == 1 || type == 4 ? sizeOfArea.width/2-(sizeOfArea.width * 0.3/2) : type == 2 ? 10 : sizeOfArea.width-50,
        y : type == 2 || type == 3 ? sizeOfArea.height / 2 - (sizeOfArea.height * 0.3/2) : type == 1 ? 10 : sizeOfArea.height-50
    }
}

const DisplayVenue = ( { venueId, eventId , aTickets,selectEvent, selected }:typeOfDisplayVenueParams )=>{

    const [venue, setVenue]:[any, Function] = useState();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [tickets, setTickets] = useState(aTickets);

    useEffect(()=>{
        fetch(`/api/v1/venue/${venueId}?event=${eventId}`)
        .then(async (response:any)=>{
            response = await response.json();
            if (!response.error && response.venue){
                setVenue(response.venue);
            }
        })
    }, [])

    console.log(venue && venue.name ? (window.innerHeight-80)/venue.sizeOfArea.height : "");

    return (<div className = "monitor-ticket-selector">
        {
            venue && venue.name && tickets.length ? <SeatVisualization seatPositions={venue.seatsDatas} sizeOfArea={{height : window.innerHeight-80, width: ((window.innerHeight-80)/venue.sizeOfArea.height)*venue.sizeOfArea.width}} seatSize={((window.innerHeight-80)/venue.sizeOfArea.height)*venue.sizeOfSeat} colorOfSeat={venue.colorOfSeat} stage={getSizeOfStage(venue.stage, {height : window.innerHeight-80, width: ((window.innerHeight-80)/venue.sizeOfArea.height)*venue.sizeOfArea.width})} marginTop={venue.stage == 1 || venue.stage == 4 ? 50 : 0} marginLeft={venue.stage == 3 || venue.stage == 2 ? 50 : 0} tickets={aTickets} selectFunction={selectEvent} selectedSeats={selected} sizeOfScale={(window.innerHeight-80)/venue.sizeOfArea.height} /> : <></>
        }
    </div>)
}

export default DisplayVenue;