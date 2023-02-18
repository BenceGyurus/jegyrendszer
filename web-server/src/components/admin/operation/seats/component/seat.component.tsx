import Draggable from "react-draggable";
type Params = {
    name : string,
    title : string,
    id : string,
    posX : number,
    posY : number
}
const Seat = ({name , title, id, posX, posY, }:Params)=>{
    return (
        <Draggable onDrag={(event, data)=>{console.log(event, data)}} defaultPosition={{x: posX, y: posY}}>
            <span>{title}<span className = "tooltip">{name}</span></span>
        </Draggable>
    )
}

export default Seat;