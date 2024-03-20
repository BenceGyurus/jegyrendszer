import { useEffect, useState } from "react";
import SeatVisualization from "../seat-visualization-engine/seats.component";
import "../../css/monitor-tickets.css";
import typeOfSeats from "../event-page/types/seatType";

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

    const getSizeOfVenue = ()=>{
        if (venue && venue.seats && venue.seats.length){
            let height = 0; let width = 0;
            venue.seats.forEach((seat:typeOfSeats, index:number)=>{
                if (index === 0 || seat.x+seat.size.width > width) width = seat.x+seat.size.width;
                if (index === 0 || seat.y+seat.size.height > height) height = seat.y+seat.size.height;
            })
            return {width : width, height : height};
        }
        return {width : 0, height : 0};
    }

    return (<div className = "monitor-ticket-selector">
        {
            venue && venue.name && tickets.length ? <SeatVisualization seatPositions={venue.seats} sizeOfArea={getSizeOfVenue()} seatSize={0} stages={venue.stages} colorOfSeat={venue.colorOfSeat} tickets={aTickets} selectFunction={selectEvent} selectedSeats={selected} sizeOfScale={1} /> : <></>
        }
    </div>)
}

export default DisplayVenue;