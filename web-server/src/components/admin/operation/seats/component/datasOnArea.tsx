import Group from "./group.component";
import Seat from "./seat.component";
import { v4 as uuid } from 'uuid';
import groupType from "../type/group";
import seatOfType from "../type/seat";


type DatasOnAreaParamsType = {
    groups : Array<groupType>,
    seats : Array<seatOfType>,
    size : number,
    selected : string,
    newPositionFunction: Function,
    showAll:boolean,
    colorOfSeat : string,
    suggestedGroups : Array<Array<string>>
};

function multiDimensionalIncludes(arr:Array<unknown>, value:boolean | string | Array<unknown> | number | object) {
    for (const subArray of arr) {
      if (Array.isArray(subArray)) {
        if (multiDimensionalIncludes(subArray, value)) {
          return true;
        }
      } else if (subArray === value) {
        return true;
      }
    }
    return false;
  }

const DatasToArea = ({groups, seats, size,selected,newPositionFunction,showAll,colorOfSeat, suggestedGroups}:DatasOnAreaParamsType)=>{

  const scrollToId = (e:Event, id:string)=>{
    console.log(id);
      const element = document.getElementById(id);
      if (element) {
        // 👇 Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: 'smooth' });
      }
  }

    return <>{groups.map(
        (group:groupType)=>{
            if (group.id == selected){
            return (<Group key = {uuid()} posX = {group.posX} posY = {group.posY} id = {group.id}>
                <>{
                    seats.map(
                        (seat:seatOfType, index:number)=>{
                                if ((seat.group == group.id) || showAll){
                                        return <Seat onClick={scrollToId} key = {uuid()} color = {multiDimensionalIncludes(suggestedGroups, seat.id) ? "red" : colorOfSeat} name = {seat.name} id = {seat.id} posX = {seat.posX} posY = {seat.posY} title = {seat.title} size = {size} newPositionFunction = {newPositionFunction} index = {index}/> 
                                    }
                                }

                    )
                }</>
            </Group>)
            }
        }
    )}</>
}

export default DatasToArea;