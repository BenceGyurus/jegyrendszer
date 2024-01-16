import Seat from "./seat.component";
import typeOfSeatListParams from "./type/seatListParams";
import typeOfSeats from "./type/seatType";

const SeatList = ({seats, selectedSeats, onClickFunction, watchingGroup, originalColor}:typeOfSeatListParams)=>{
    return (<div>
        {
            seats.map((seatsArray)=>{
                return seatsArray ? seatsArray?.seats?.map((seatList)=>{
                    return seatList.map((seat)=>{
                        return seat != null ? <Seat originalColor = {originalColor} editColor={seatsArray.sector.color} isWatchingGroup={seatsArray.sector.id === watchingGroup} onClickFunction = {onClickFunction} seat={seat} selectedSeats={selectedSeats} /> : <></>
                    })
                }) : "";
            })
        }
    </div>)
}

export default SeatList;