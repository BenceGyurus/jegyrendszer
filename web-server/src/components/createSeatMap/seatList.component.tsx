import Seat from "./seat.component";
import typeOfSeat from "./type/seat";
import typeOfSeatListParams from "./type/seatListParams";

const SeatList = ({seats, groups, onClickFunction, selectedSeats}:typeOfSeatListParams)=>{
    return <> 
    {seats.map((seat:typeOfSeat)=>{
        return <Seat isSelected = {selectedSeats?.includes(seat.id)} seat={seat} background={`${ selectedSeats?.includes(seat.id) ? "#82d5ff" : groups ? groups.find(group=>group.id===seat.group)?.color : "black"}`} onClickFunction={onClickFunction} />
    })}
    </>
}

export default SeatList;