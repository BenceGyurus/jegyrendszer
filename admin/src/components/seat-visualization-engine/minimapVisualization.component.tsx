import drawSeat from "./drawSeat";
import typeOfMinimapParams from "./types/typeOfMinimapParams";
import React, { useEffect } from "react";

const MiniMapVisualization = ({sizeOfArea, seats, canvasKey, selectedSeats, selectedColor}:typeOfMinimapParams)=>{

        const canvasRef:any = React.useRef(null);

        const render = () => {
            const canvas: any = canvasRef.current;
            const ctx = canvas.getContext("2d");
    
            //return place === seat.id ? <Seat marginLeft = {getMinX()/2} marginTop = {marginTop} color={places.colorOfSeat} seat={seat} size = {places.sizeOfSeat} classname = {!ticket.boughtPlaces.includes(seat.id) ? !ticket.pendingPlaces.includes(seat.id) ? ticket.amount > 0 ? seleted.includes(seat.id) ? "user-selected"  : ticket.selected >= ticket.amount ? "user-disabled" : "user-allowed" : "user-disabled" : "user-pending" : "user-bought"} onClickFunction = {onClickFunction} /> : "";
            const drawSeats = () => {
                ctx.clearRect(0, 0, sizeOfArea.width, sizeOfArea.height);
                seats.forEach(seat=>{
                    drawSeat(
                        seat.x,
                        seat.y,
                        true,
                        false,
                        false,
                        false,
                        ctx,
                        seat.size.width,
                        seat.size.height,
                        selectedSeats ? selectedSeats?.includes(seat.id) ? selectedColor ? selectedColor : "red" : seat.color : seat.color,
                      );
                });
              };
            drawSeats();
            //drawStage();
          };

        useEffect(()=>{
            render();
        }, [sizeOfArea,  seats]);

        return <canvas id = {canvasKey} key={canvasKey} ref={canvasRef}/>
    };

export default MiniMapVisualization;