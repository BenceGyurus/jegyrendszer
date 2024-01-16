import "../../../css/venuesStyle.css";
import SmallMap from "./smallMap.component"
import postData from "../../connection/request";
import ParseLocalStorage from "../../../cookies/ParseLocalStorage";
import Tooltip from "../../tooltip/tooltip.component";
import { Card, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import StringAvatar from "../../avatar/avatar.component";
import Meta from "antd/es/card/Meta";

type typeOfSeats = {
    name : string,
    id : string,
    x : number,
    y : number,
    color : string,
    width : number,
    height : number
}

type typeOfVenueDatas = {
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
        const max = seats.reduce((acc, obj) => {
            acc.x = Math.max(acc.x, obj.x);
            acc.y = Math.max(acc.y, obj.y);
            return acc;
        }, { x: -Infinity, y: -Infinity });
        
        if (max.x && max.y) return {width : max.x, height : max.y};
    
        return {width : 0, height : 0};
    }
    

    return(<div className = "venue-list"> {venues.map((element, index)=>{
        console.log(element);
        return (
            <Card bordered = {true} cover = {
              element.seats.length ? <SmallMap sizeOfArea={getSizeOfArea(element.seats)} colorOfBackGround = {element.colorOfBackGround} sizeOfSeats = {element.sizeOfSeat} colorOfSeat = {element.colorOfSeat} seatDatas = {element.seats} /> : <img className = "card-logo" src="/images/logo.png" alt="agora logo" />
            }
            actions={[<DeleteOutlined onClick = {event=>handleDeleteFunction(element.id)} />, <EditOutlined onClick = {e => {handleEditFunction(element.id)}} />]}>
            <div className = "venue-list-venue-body">
                <StringAvatar username={element.addedBy} />
                <div className = "venue-datas-holder">
                    <Tag bordered = {true} color={element.seats.length ? "blue" : "magenta"}>
                        {element.seats.length ? "ülő" : "álló"}
                    </Tag>
                    { element.seats.length ? <Tag bordered = {true} color = "red">
                        {element.seats.length} ülőhely
                    </Tag> : <></>}
                    <h3 className = "venue-name">{element.name}</h3>
                </div>
            </div>
            </Card>
        );})}
        </div>)
}
export default VenueList;