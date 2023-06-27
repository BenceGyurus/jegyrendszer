import "../../../css/seat.css";

type typesOfNonDragableSeatParams = {
    size : number,
    color : string,
    posX : number,
    posY : number,
}


const NonDragableSeat = ({size, color, posX, posY}:typesOfNonDragableSeatParams)=>{
    return (
    <span className = "seat" style={{width : size, height : size, top : posY-size/2, left : posX-size/2, background: color, position:"absolute", display:"inline", borderRadius:Math.ceil(size/3), cursor:"auto"}}>

    </span>
    )
}

export default NonDragableSeat;