import { useState } from "react"
import "../../../../../css/select_Places.css";
import { v4 as uuid } from 'uuid';
import Window from "../../../../window/window.component";
import { Empty } from "antd";


type typeOfShowSeatsParams = {
    datasOfVenue : typeOfVenues,
    closeFunction : Function,
    addNewSeat : Function,
    seatList : Array<string>,
    allSelected : Array<string>,
};

type typeOfGroups = {
    id : string,
    name : string,
    opened : boolean,
    posX : number,
    posY : number,
    status : boolean
};

type typeOfPlace = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string
}

type typeOfVenues = {
    background : {isImage : boolean, name : string},
    colorOfBackGround : string,
    colorOfSeat : string,
    groups : Array<typeOfGroups>,
    id : string,
    name : string,
    places : number,
    seatDatas : Array<typeOfPlace>,
    seatMode : boolean,
    selecttedGroup : string,
    sizeOfArea : {width : number, height : number},
    sizeOfSeat : number,
    suggestedGroups : Array<string>
}

const ShowSeats = ({datasOfVenue, closeFunction, addNewSeat, seatList, allSelected}:typeOfShowSeatsParams)=>{

    const [venueData, setVenueData]:any = useState(datasOfVenue);
    const [status, setStatus]:[boolean, Function] = useState(false);
   
    const getWidthOfSeats = ()=>{
        let maxWidth = -1;
        let maxHeight = -1;
        venueData.seats.forEach((seat:any, index:number)=>{
            if (index === 0 || seat.x > maxWidth) maxWidth = seat.x;
            if (index === 0 || seat.x > maxHeight) maxHeight = seat.y;
        })
        return {
            height : maxHeight,
            width : maxWidth
        }
    }

    //style = {{width : venueData.sizeOfArea.width, height : venueData.sizeOfArea.height}}

    return (

        <Window title = "Helyek kiválasztása" closeFunction={closeFunction} >
            <div className = "select-place-div-2">
            {venueData ? <div className = "select-places-place-div" style={{...getWidthOfSeats()}}>
            {
                venueData ? venueData.seats.map(
                    (venue:any)=>{
                        return !allSelected.includes(venue.id) || seatList.includes(venue.id) ? <span key = {uuid()} onClick={e => {addNewSeat(venue.id); setStatus(!status)}} className = "place" style = {{ background:`${seatList.includes(venue.id) ? "red":"black"}`, width : venue.size.width, height : venue.size.height, position: "absolute", top : venue.y, left : venue.x}}></span> : "";
                    }
                ): <Empty />
            }
            </div> : <Empty />}
            </div>
        </Window>
    )
}

export default ShowSeats