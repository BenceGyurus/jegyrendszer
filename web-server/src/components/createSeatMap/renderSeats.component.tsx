import typeOfRenderSeatsParams from "./type/renderSeatsParams";
import "../../css/render-seats.css";

const RenderSeats = ({ area , spaceBetween, sizeOfSeat }:typeOfRenderSeatsParams)=>{
    return <div><span className = "amount-of-seats">{Math.floor((area.width+2*spaceBetween.x)/(sizeOfSeat.width+spaceBetween.x) )}X{Math.floor((area.height+2*spaceBetween.y)/(sizeOfSeat.height+spaceBetween.y))}</span>{Array.from({length : Math.floor((area.height+2*spaceBetween.y)/(sizeOfSeat.height+spaceBetween.y)) }).map((_, hIndex)=>{
        return Array.from({length : (area.width+2*spaceBetween.x)/(sizeOfSeat.width+spaceBetween.x) }).map((_, wIndex)=>{
            return <span style = {{position : "absolute", top : hIndex*(sizeOfSeat.height+spaceBetween.y), left : wIndex*(sizeOfSeat.width+spaceBetween.x), width : sizeOfSeat.width, height : sizeOfSeat.height, background : "black" }}>{}</span>
        })
    })}</div>
}

export default RenderSeats;