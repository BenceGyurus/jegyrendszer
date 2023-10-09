import "../../../css/venuesStyle.css";
import SmallMap from "./smallMap.component"
import postData from "../../connection/request";
import ParseLocalStorage from "../../../cookies/ParseLocalStorage";
import Tooltip from "../../tooltip/tooltip.component";
import { Card, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import StringAvatar from "../../avatar/avatar.component";
import Meta from "antd/es/card/Meta";

type typeOfVenueDatas = {
    name : string,
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
    

    return(<div className = "venue-list"> {venues.map((element, index)=>{
        return (
            <Card bordered = {true} cover = {
              element.seatsDatas.length ? <SmallMap sizeOfArea={element.sizeOfArea} colorOfBackGround = {element.colorOfBackGround} sizeOfSeats = {element.sizeOfSeat} colorOfSeat = {element.colorOfSeat} seatDatas = {element.seatsDatas} /> : <img className = "card-logo" src="/images/logo.png" alt="agora logo" />
            }
            actions={[<DeleteOutlined onClick = {event=>handleDeleteFunction(element.id)} />, <EditOutlined onClick = {e => {handleEditFunction(element.id)}} />]}>
            <div className = "venue-list-venue-body">
                <StringAvatar username={element.addedBy} />
                <div className = "venue-datas-holder">
                    <Tag bordered = {false} color={element.seatsDatas.length ? "blue" : "magenta"}>
                        {element.seatsDatas.length ? "ülő" : "álló"}
                    </Tag>
                    <h3 className = "venue-name">{element.name}</h3>
                </div>
            </div>
            </Card>
        );})}
        </div>)
}
export default VenueList;