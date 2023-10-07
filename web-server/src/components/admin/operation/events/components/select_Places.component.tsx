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
   

    //style = {{width : venueData.sizeOfArea.width, height : venueData.sizeOfArea.height}}

    return (

        <Window title = "Helyek kiválasztása" closeFunction={closeFunction} >
            <div className = "select-place-div-2">
            {venueData ? <div className = "select-places-place-div">
            {
                venueData ? venueData.seatsDatas.map(
                    (venue:any)=>{
                        return !allSelected.includes(venue.id) || seatList.includes(venue.id) ? <span key = {uuid()} onClick={e => {addNewSeat(venue.id); setStatus(!status)}} className = "place" style = {{background:`${seatList.includes(venue.id) ? "red":"black"}`, width : venueData.sizeOfSeat, position: "absolute", top : venue.posY, left : venue.posX, height: venueData.sizeOfSeat}}></span> : "";
                    }
                ): <Empty />
            }
            </div> : <Empty />}
            </div>
        </Window>
    )
}

export default ShowSeats