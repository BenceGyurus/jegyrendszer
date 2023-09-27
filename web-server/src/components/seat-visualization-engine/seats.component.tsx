import React, { useState } from 'react';
import drawSeat from './drawSeat';
import Loader from '../loader/loader.component';
import "../../css/seat-engine.css";
import { Spin } from 'antd';

type typeOfSeatPostions = {
  x : number,
  y : number,
  isAvailable : boolean,

}


type typeOfPlaces = {
  background : {isImage : boolean, name : "string"},
  colorOfBackground : string,
  colorOfSeat : string,
  seatsDatas : Array<typeOfSeat>,
  sizeOfArea : {width : number, height : number},
  sizeOfSeat : number,
  stage : number,
}

type typeOfSeat = {
  group : string,
  id : string,
  name : string,
  posX : number,
  posY : number,
  title : string
}

type typeOfAmountTicket = {
  id : string,
  numberOfTicket : number,
  seats : Array<string>,
  price : number,
  name : string,
  ticketId : string,
  amount : number,
  selected : number,
  pendingPlaces : Array<string>,
  boughtPlaces : Array<string>
}

type typeOfSeatVisualizationParams = {
    seatPositions : Array<typeOfSeat>,
    sizeOfArea : {width : number, height : number},
    colorOfSeat : string,
    seatSize : number,
    stage : {width : number, height : number, x : number, y : number},
    marginTop : number,
    marginLeft : number,
    tickets : Array<typeOfAmountTicket>,
    selectedSeats : Array<string>,
    selectFunction : Function,
    sizeOfScale? : number,
    disabled? : boolean
}


const SeatVisualization = ({seatPositions, sizeOfArea, colorOfSeat, seatSize, stage, marginTop, marginLeft, tickets, selectedSeats, selectFunction, sizeOfScale, disabled}:typeOfSeatVisualizationParams) => {
  const canvasRef = React.useRef(null);

  const [progress, setProgress] = useState(false);
  const [scale, setScale] = useState(sizeOfScale ? sizeOfScale : 1);

  const render = ()=>{

  const canvas:any = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawStage = () => {
      const gradient = ctx.createLinearGradient(stage.x*scale, stage.y*scale, stage.x*scale, stage.y*scale + stage.height);
      gradient.addColorStop(0, '#212121'); // Darker color at the top
      gradient.addColorStop(1, '#424242'); // Lighter color at the bottom

      const cornerRadius = 10; // Adjust the corner radius to control the roundness of corners

      ctx.beginPath();
      ctx.moveTo(stage.x*scale + cornerRadius, stage.y*scale);
      ctx.arcTo(stage.x*scale + stage.width, stage.y*scale, stage.x*scale + stage.width, stage.y*scale + cornerRadius, cornerRadius);
      ctx.arcTo(stage.x*scale + stage.width, stage.y*scale + stage.height, stage.x*scale + stage.width - cornerRadius, stage.y*scale + stage.height, cornerRadius);
      ctx.arcTo(stage.x*scale, stage.y*scale + stage.height, stage.x*scale, stage.y*scale + stage.height - cornerRadius, cornerRadius);
      ctx.arcTo(stage.x*scale, stage.y*scale, stage.x*scale + cornerRadius, stage.y*scale, cornerRadius);
      ctx.closePath();
      ctx.fillStyle = gradient; // Gradient fill
      ctx.fill();
    };


    

  //return place === seat.id ? <Seat marginLeft = {getMinX()/2} marginTop = {marginTop} color={places.colorOfSeat} seat={seat} size = {places.sizeOfSeat} classname = {!ticket.boughtPlaces.includes(seat.id) ? !ticket.pendingPlaces.includes(seat.id) ? ticket.amount > 0 ? seleted.includes(seat.id) ? "user-selected"  : ticket.selected >= ticket.amount ? "user-disabled" : "user-allowed" : "user-disabled" : "user-pending" : "user-bought"} onClickFunction = {onClickFunction} /> : "";

  const drawSeats = () => {
    ctx.clearRect(0, 0, sizeOfArea.width, sizeOfArea.height);
    if (tickets){tickets.forEach(ticket=>{
      ticket.seats.forEach(place=>{
          //const isSelected = selectedSeats.some((selectedSeat:any) => selectedSeat.x === seat.x && selectedSeat.y === seat.y);
          let seat = seatPositions.find(pos => pos && pos.id == place);
          if (seat && seat.id == place){
            drawSeat((seat.posX)*scale+marginLeft, seat.posY*scale+marginTop, !ticket.boughtPlaces.includes(seat.id), selectedSeats.includes(seat.id) , ticket.pendingPlaces.includes(seat.id), ticket.amount <= ticket.selected, ctx, seatSize, colorOfSeat)
          }
      })
    });}
  };
  drawSeats();
  drawStage();
}

  React.useEffect(() => {
    render();
  }, [selectedSeats, tickets]);


  const handleSeatClick = (x:number, y:number) => {
    if (!disabled){
    setProgress(true);
    const clickedSeat = seatPositions.find((seat:any) => seat && seat.posX*scale+marginLeft <= x && x <= seat.posX*scale+seatSize+marginLeft && seat.posY*scale+marginTop <= y && y <= seat.posY*scale+seatSize+marginTop);
    if (clickedSeat && clickedSeat.id) {
      selectFunction(clickedSeat.id);
      //setSelectedSeats((prevSelectedSeats:any) => [...prevSelectedSeats, clickedSeat]);
    }
    setProgress(false);
    render();
  }
  };

  return !progress ? <Spin size='large' spinning={disabled ? disabled : false}><div className = "seat-map-canvas-holder" ><canvas ref={canvasRef} width={sizeOfArea.width+2*marginLeft} height={sizeOfArea.height+2*marginTop} onClick={(e) => handleSeatClick(e.nativeEvent.offsetX, e.nativeEvent.offsetY)} />{ disabled ?  <div className="canvas-overlay"></div> : ""}</div></Spin> : <div style={{width : sizeOfArea.width+2*marginLeft, height : sizeOfArea.height+2*marginTop}}><Loader /></div>;
};

export default SeatVisualization;
