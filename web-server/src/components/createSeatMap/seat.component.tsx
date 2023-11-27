import typeOfSeatParams from "./type/seatParams";


const Seat = ({ seat, onClickFunction,isSelected, background}:typeOfSeatParams)=>{
    return <span className = "" style={{background : background, borderRadius : "15%", position : "absolute", top : seat.y, left : seat.x, width : seat.width, height : seat.height, display : "inline-flex", }}></span>
}

export default Seat;