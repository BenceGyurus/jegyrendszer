import Draggable from "react-draggable";
import "../../../../../css/seat.css"
import { v4 as uuid } from 'uuid';
type Params = {
    name : string,
    title : string,
    id : string,
    posX : number,
    posY : number,
    size : number,
    newPositionFunction:any,
    index:number,
    color : string
}
const Seat = ({name , title, id, posX, posY, size,newPositionFunction,index, color}:Params)=>{
    return (
        <Draggable onStop={(event:any, data)=>{newPositionFunction(index, data.lastX, data.lastY)}} key = {uuid()}>
            <span className = "seat" style = {{background : color ,width : size, height: size, position: "absolute", top : `${posY}px`, left : `${posX}px`, borderRadius : Math.ceil(size/5), fontSize : `${size/1.5}px`, color : "white"}}>{title}{name ? <span className = "tooltip">{name}</span> : ""}</span>
        </Draggable>
    )
}

//newPositionFunction(index, event.screenX, event.screenY)}

export default Seat;