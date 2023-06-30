import "../../../css/venuesStyle.css";
import SmallMap from "./smallMap.component"
import postData from "../../connection/request";
import ParseLocalStorage from "../../../cookies/ParseLocalStorage";
import Tooltip from "../../tooltip/tooltip.component";

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
    

    return venues.map((element, index)=>{
        return (
            <div key={element.id} className = "venue">
                <SmallMap sizeOfArea={element.sizeOfArea} colorOfBackGround = {element.colorOfBackGround} sizeOfSeats = {element.sizeOfSeat} colorOfSeat = {element.colorOfSeat} seatDatas = {element.seatsDatas} />
                <div className = "venue-body">
                <h3 className = "venue-title">{element.name}</h3>
                <div className = "venue-buttons">
                <input type="button" value="Szerkesztés" className = "edit-button" onClick = {e => {handleEditFunction(element.id)}} />
                <input type="button" value="Törlés" className = "delete-button" onClick = {event=>handleDeleteFunction(element.id)} />
                </div>
                <div className = "tooltip-position-div"><Tooltip title = {<i className="fas fa-info-circle"></i>} text = {`Hozzáadta: ${element.addedBy}`} /></div>
                </div>
            </div>
        );
    });
}
export default VenueList;