import "../../../css/seat.css";

type typesOfNonDragableSeatParams = {
    color : string,
    posX : number,
    posY : number,
    width : number,
    height : number
}


const NonDragableSeat = ({width, height, color, posX, posY}:typesOfNonDragableSeatParams)=>{
    return (
    <span className = "seat" style={{width : width, height : height, top : posY-height/2, left : posX-width/2, background: color, position:"absolute", display:"flex", borderRadius:"30%", cursor:"auto"}}>

    </span>
    )
}

export default NonDragableSeat;