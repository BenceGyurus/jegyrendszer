import Seat from "./seat.component";
import typeOfSeatListParams from "./type/seatListParams";

const SeatList = ({
  seats,
  selectedSeats,
  onClickFunction,
  watchingGroup,
  originalColor,
  isSelecting,
}: typeOfSeatListParams) => {
  return (
    <div>
      {seats.map((seatsArray) => {
        console.log(seatsArray);
        return seatsArray
          ? seatsArray?.seats?.map((seatList) => {
              return seatList.map((seat) => {
                return seat != null ? (
                  <Seat
                    isSelecting={isSelecting}
                    originalColor={originalColor}
                    editColor={seatsArray.sector.color}
                    isWatchingGroup={seatsArray.sector.id === watchingGroup}
                    onClickFunction={onClickFunction}
                    seat={seat}
                    selectedSeats={selectedSeats}
                  />
                ) : (
                  <></>
                );
              });
            })
          : "";
      })}
    </div>
  );
};

export default SeatList;
