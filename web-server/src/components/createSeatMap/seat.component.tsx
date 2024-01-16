import typeOfSeatParamsType from "./type/seatParamsType";
import { ShakeLittle, ShakeSlow, ShakeHorizontal } from 'reshake'

const Seat = ({seat, selectedSeats, onClickFunction, isWatchingGroup, editColor, originalColor}:typeOfSeatParamsType)=>{
   const editColorToString = ():string=>{
      return `rgb(${editColor.red}, ${editColor.blue}, ${editColor.green})`;
   }
   return  <span onDoubleClick={e=>onClickFunction({...e, id : seat.id})} key = {seat?.id} className = {`editing-seat ${seat?.className}${selectedSeats.includes(seat?.id) ? " shake" : ""}`} style = {{animationDelay : selectedSeats.includes(seat?.id)?  `${Math.random()}s` : "0s", background :  !isWatchingGroup  ? originalColor ? seat.color : editColorToString(): "red", top : seat.y, left: seat.x, width : seat.size.width, height : seat.size.height, fontSize : seat?.fontSize}}>{seat?.title}</span>
};

export default Seat;