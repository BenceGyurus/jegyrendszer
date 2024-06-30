import "../../../css/venuesStyle.css";
import SmallMap from "./smallMap.component"
import postData from "../../connection/request";
import ParseLocalStorage from "../../../cookies/ParseLocalStorage";
import Tooltip from "../../tooltip/tooltip.component";
import { Card, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import StringAvatar from "../../avatar/avatar.component";
import Meta from "antd/es/card/Meta";
import EventSkeleton from "../operation/events/components/event_Skeleton.component";
import { Skeleton } from "@mui/material";
import { useState } from "react";
import Venue from "./venue.component";

type typeOfSeats = {
    name : string,
    id : string,
    x : number,
    y : number,
    color : string,
    width : number,
    height : number
}

export type typeOfVenueDatas = {
    name : string,
    seats : Array<typeOfSeats>
    places : number,
    colorOfBackGround : string,
    seatsDatas : any,
    id : any,
    sizeOfSeat : number,
    colorOfSeat : string,
    sizeOfArea : {width : number, height: number},
    addedBy : string
}

type typeOfVenueListParams = {
    venues : Array<typeOfVenueDatas>,
    newRequest : Function
}
const VenueList = ({ venues, newRequest }:typeOfVenueListParams):any=>{

    const [openPopConfirm, setOpenPopConfirm] = useState<boolean>(false);

    const handleDeleteFunction = (id:string)=>{
        postData(`/delete-venue/${id}`, {token : ParseLocalStorage("long_token")})
        .then((data)=>{
            newRequest();
        });
    }

    const handleEditFunction = (id:string)=>{
        window.location.href = `/admin/terem-szerkesztes/${id}`;
    }


    const getSizeOfArea = (seats:Array<typeOfSeats>)=>{
        let maxX = 0;
        let maxY = 0;
        if (seats && seats.length){
            maxX = Math.max(...seats.map((seat:any) => {return seat.x + (seat.size.width/2)}));
            maxY = Math.max(...seats.map((seat:any) => {return seat.y + (seat.size.height/2)}));
        }
        console.log(maxX, maxY);
        return {
            width : maxX,
            height : maxY
        }
    }
    

    return(<div className = "venue-list"> {venues.length ? venues.map((element, index)=>{
        return (
            <Venue size={getSizeOfArea(element.seats)} element={element} handleDeleteFunction={handleDeleteFunction} handleEditFunction={handleEditFunction} />
        );}) : <Skeleton height={500} style={{marginTop: 0}}></Skeleton>}
        </div>)
}
export default VenueList;