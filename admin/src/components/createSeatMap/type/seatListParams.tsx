import typeOfSeats from "./seatsType";

type typeOfSeatListParams = {
  seats: typeOfSeats;
  selectedSeats: Array<string>;
  onClickFunction: Function;
  watchingGroup: string;
  originalColor: boolean;
  isSelecting?: boolean;
};

export default typeOfSeatListParams;
