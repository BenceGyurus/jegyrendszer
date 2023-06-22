type typeOfSeat = {
    group : string,
    id : string,
    name : string,
    posX : number,
    posY : number,
    title : string
}

type typeOfSeatParams = {
    seat : typeOfSeat,
    color : string,
    size : number,
    classname : string,
    onClickFunction: Function
}
const Seat = ({seat, color, size, classname, onClickFunction}:typeOfSeatParams)=>{
    return (
        <span onClick={e => onClickFunction(seat.id)} style = {{position:"absolute", top : seat.posY, left : seat.posX, background : color, width : size, height : size, fontSize: size*0.5,display:"inline-table", borderRadius: Math.ceil(size/5)}} className={`seat ${classname}`}>
            {seat.title}
        </span>
    )
}

export default Seat;