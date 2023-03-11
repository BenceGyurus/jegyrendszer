import "../../../css/venuesStyle.css";
import SmallMap from "./smallMap.component"
import postData from "../../connection/request";
import ParseCookies from "../../../cookies/parseCookies";

type typeOfVenueDatas = {
    name : string,
    places : number,
    colorOfBackGround : string,
    seatsDatas : any,
    id : any,
    sizeOfSeat : number,
    colorOfSeat : string,
    sizeOfArea : {width : number, height: number},
}

type typeOfVenueListParams = {
    venues : Array<typeOfVenueDatas>,
    newRequest : Function
}
const VenueList = ({ venues, newRequest }:typeOfVenueListParams):any=>{

    const handleDeleteFunction = (id:string)=>{
        postData(`/delete-venue/${id}`, {token : ParseCookies().long_token})
        .then((data)=>{
            newRequest();
        });
    }
    

    return venues.map((element, index)=>{
        return (
            <div key={element.id} className = "venue">
                <SmallMap sizeOfArea={element.sizeOfArea} colorOfBackGround = {element.colorOfBackGround} sizeOfSeats = {element.sizeOfSeat} colorOfSeat = {element.colorOfSeat} seatDatas = {element.seatsDatas} />
                <div className = "venue-body">
                <h3 className = "venue-title">{element.name}</h3>
                <div className = "venue-buttons">
                <input type="button" value="Szerkesztés" className = "edit-button" />
                <input type="button" value="Törlés" className = "delete-button" onClick = {event=>handleDeleteFunction(element.id)} />
                </div>
                </div>
            </div>
        );
    });
}
export default VenueList;