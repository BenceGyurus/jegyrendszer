import Group from "./group.component";
import Seat from "./seat.component";
import { v4 as uuid } from 'uuid';

type groupType = {
    name : string,
    id : string,
    posX : number,
    posY : number,
    status : boolean,
    opend: boolean
}

type seatOfType = {
    name : string,
    title : string,
    id : string,
    posX : number,
    posY : number,
    group : string
}


type DatasOnAreaParamsType = {
    groups : Array<groupType>,
    seats : Array<seatOfType>,
    size : number,
    selected : string,
    newPositionFunction: any,
    showAll:boolean,
    colorOfSeat : string
};

const DatasToArea = ({groups, seats, size,selected,newPositionFunction,showAll,colorOfSeat}:DatasOnAreaParamsType):any=>{
    return (groups.map(
        (group:any)=>{
            if (group.id == selected){
            return (<Group key = {uuid()} posX = {group.posX} posY = {group.posY} id = {group.id}>
                {
                    seats.map(
                        (seat:any, index:number)=>{
                            if ((seat.group == group.id) || showAll){
                                return <Seat key = {uuid()} color = {colorOfSeat} name = {seat.name} id = {seat.id} posX = {seat.posX} posY = {seat.posY} title = {seat.title} size = {size} newPositionFunction = {newPositionFunction} index = {index}/>
                            }
                        }
                    )
                }
            </Group>)
            }
        }
    ));
}

export default DatasToArea;