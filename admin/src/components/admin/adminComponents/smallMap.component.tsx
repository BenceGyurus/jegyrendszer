import NonDragableSeat from "./nonDragableSeat.component";
import { useState, useEffect } from "react";
import { v4 as uuid } from 'uuid';
import "../../../css/smallMap.css"
import SeatVisualization from "../../seat-visualization-engine/seats.component";
import MiniMapVisualization from "../../seat-visualization-engine/minimapVisualization.component";
import typeOfSeat from "../../seat-visualization-engine/types/typeOfSeat";
type typesOfSmallMapParams = {
    sizeOfArea : {width : number, height : number},
    colorOfBackGround : string,
    sizeOfSeats : number,
    colorOfSeat : string,
    seatDatas : Array<any>,
    selectedSeats? : Array<string>,
    selectColor? : string
};


const SmallMap = ({sizeOfArea, colorOfBackGround, sizeOfSeats, colorOfSeat, seatDatas, selectedSeats, selectColor}:typesOfSmallMapParams) =>{

    const [expectedWidth, setExpectedWidth] = useState(300);
    const [exprectedHeight, setExpectedHeight] = useState(170);

    useEffect(()=>{
        if (!sizeOfArea.width || !sizeOfArea.height){
            sizeOfArea = {width : 800, height : 1200}
        }
    })


    const getSizeOfArea = (width:number, height:number):{width:number, height:number}=>{
        return {
            width : expectedWidth,
            height : exprectedHeight
        };
    }

    console.log(seatDatas);
    const calculateSeatDatas = (seatDatas:Array<typeOfSeat>, width:number, height:number, expectedWidth:number, selectedSeats:Array<String>|undefined, selectColor:string|undefined)=>{
        let e = (expectedWidth/width < exprectedHeight/height ? expectedWidth/width : exprectedHeight/height)*0.78;
        let l = [...seatDatas];
        l.forEach(seat=>{
            seat.size.width*=e;
            seat.size.height*=e;
            seat.x = seat.x * e;
            seat.y = seat.y * e;
        });
        return l;
        };


        return (
            <MiniMapVisualization canvasKey={uuid()} selectedColor={selectColor} selectedSeats={selectedSeats}  seats={calculateSeatDatas(seatDatas, sizeOfArea.width, sizeOfArea.height, expectedWidth, selectedSeats, selectColor)} sizeOfArea={getSizeOfArea(sizeOfArea.width, sizeOfArea.height)} originSizeOfArea={sizeOfArea} />
        )

}


/*

<div className = "map" style={{background : colorOfBackGround, height : getSizeOfArea(sizeOfArea.width, sizeOfArea.height).height , width:getSizeOfArea(sizeOfArea.width, sizeOfArea.height).width, position:"relative" }} key = {uuid()}>
            {seatDatas.map(
                (element)=>{
                    return <NonDragableSeat width={calculateSeatDatas(sizeOfArea.width, element.x, element.y, element.size.width, element.size.height).seatWidth} height = {calculateSeatDatas(sizeOfArea.width, element.x, element.y, element.size.width, element.size.height).seatHeight} color = {selectedSeats && selectedSeats.includes(element.id) ? selectColor : element.color} posX = {calculateSeatDatas(sizeOfArea.width, element.x, element.y, element.size.width, element.size.height).posX} posY = {calculateSeatDatas(sizeOfArea.width, element.x, element.y, element.size.width, element.size.height).posY} key = {uuid()} />;
                }
            )}
            </div>

*/

export default SmallMap;