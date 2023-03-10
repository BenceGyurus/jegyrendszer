import NonDragableSeat from "./nonDragableSeat.component";
import { useState } from "react";
import { v4 as uuid } from 'uuid';
import "../../../css/smallMap.css"
type typesOfSmallMapParams = {
    sizeOfArea : {width : number, height : number},
    colorOfBackGround : string,
    sizeOfSeats : number,
    colorOfSeat : string,
    seatDatas : Array<any>
};
const SmallMap = ({sizeOfArea, colorOfBackGround, sizeOfSeats, colorOfSeat, seatDatas}:typesOfSmallMapParams) =>{

    const [expectedWidth, setExpectedWidth] = useState(250);

    const getSizeOfArea = (width:number, height:number):{width:number, height:number}=>{
        return {
            width : expectedWidth,
            height : Math.floor(expectedWidth/width*height)
        };
    }

    const calculateSeatDatas = (width:number, sizeOfSeat:number, posX:number, posY:number)=>{
        let e = expectedWidth/width;
        console.log(posX, posX*e, Math.floor(posX*e));
        return {
            sizeOfSeat : Math.ceil(sizeOfSeat*e),
            posX : Math.floor(posX*e),
            posY : Math.floor(posY*e)
        }
    };

    return (
        <div className = "map" style={{background : colorOfBackGround, height : getSizeOfArea(sizeOfArea.width, sizeOfArea.height).height , width:getSizeOfArea(sizeOfArea.width, sizeOfArea.height).width, position:"relative" }} key = {uuid()}>
        {seatDatas.map(
            (element)=>{
                return <NonDragableSeat size = {calculateSeatDatas(sizeOfArea.width, sizeOfSeats, element.posX, element.posY).sizeOfSeat} color = {colorOfSeat} posX = {calculateSeatDatas(sizeOfArea.width, sizeOfSeats, element.posX, element.posY).posX} posY = {calculateSeatDatas(sizeOfArea.width, sizeOfSeats, element.posX, element.posY).posY} key = {uuid()} />;
            }
        )}
        </div>
    )
}

export default SmallMap;