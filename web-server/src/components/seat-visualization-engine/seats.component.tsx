import React from 'react';


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
  places : Array<string>,
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
    selectFunction : Function
}


const SeatVisualization = ({seatPositions, sizeOfArea, colorOfSeat, seatSize, stage, marginTop, marginLeft, tickets, selectedSeats, selectFunction}:typeOfSeatVisualizationParams) => {
  const canvasRef = React.useRef(null);
  stage.x += marginLeft;
  stage.y += marginTop/2;

  const render = ()=>{

  const canvas:any = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawStage = () => {
      const gradient = ctx.createLinearGradient(stage.x, stage.y, stage.x, stage.y + stage.height);
      gradient.addColorStop(0, '#212121'); // Darker color at the top
      gradient.addColorStop(1, '#424242'); // Lighter color at the bottom

      const cornerRadius = 10; // Adjust the corner radius to control the roundness of corners

      ctx.beginPath();
      ctx.moveTo(stage.x + cornerRadius, stage.y);
      ctx.arcTo(stage.x + stage.width, stage.y, stage.x + stage.width, stage.y + cornerRadius, cornerRadius);
      ctx.arcTo(stage.x + stage.width, stage.y + stage.height, stage.x + stage.width - cornerRadius, stage.y + stage.height, cornerRadius);
      ctx.arcTo(stage.x, stage.y + stage.height, stage.x, stage.y + stage.height - cornerRadius, cornerRadius);
      ctx.arcTo(stage.x, stage.y, stage.x + cornerRadius, stage.y, cornerRadius);
      ctx.closePath();
      ctx.fillStyle = gradient; // Gradient fill
      ctx.fill();
    };


    const drawSeat = (x:number, y:number, isAvailable:boolean, isSelected:boolean, pending:boolean, disabled:boolean) => {
      const seatHeight = seatSize;
      const cornerRadius = 2;

      const gradient = ctx.createLinearGradient(x, y, x, y + seatHeight);
      if (isSelected) {
        gradient.addColorStop(0,'#3DA4FF'); // Blue for available, red for occupied
        gradient.addColorStop(1,'#3496E2');
      }else{
      gradient.addColorStop(0, pending ? "yellow" : isAvailable ? disabled ? "grey" :  colorOfSeat : '#FF6767'); // Blue for available, red for occupied
      gradient.addColorStop(1, pending ? "yellow" : isAvailable ? disabled ?  "grey"  : "rgba(0,0,0,0.9)" : '#FF5E5E'); // Slightly darker shade
      }

      ctx.beginPath();
      ctx.moveTo(x + cornerRadius, y);
      ctx.arcTo(x + seatSize, y, x + seatSize, y + cornerRadius, cornerRadius);
      ctx.arcTo(x + seatSize, y + seatHeight, x + seatSize - cornerRadius, y + seatHeight, cornerRadius);
      ctx.arcTo(x, y + seatHeight, x, y + seatHeight - cornerRadius, cornerRadius);
      ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

    };

  //return place === seat.id ? <Seat marginLeft = {getMinX()/2} marginTop = {marginTop} color={places.colorOfSeat} seat={seat} size = {places.sizeOfSeat} classname = {!ticket.boughtPlaces.includes(seat.id) ? !ticket.pendingPlaces.includes(seat.id) ? ticket.amount > 0 ? seleted.includes(seat.id) ? "user-selected"  : ticket.selected >= ticket.amount ? "user-disabled" : "user-allowed" : "user-disabled" : "user-pending" : "user-bought"} onClickFunction = {onClickFunction} /> : "";

  const drawSeats = () => {
    ctx.clearRect(0, 0, sizeOfArea.width, sizeOfArea.height);
    tickets.forEach(ticket=>{
      ticket.places.forEach(place=>{
        seatPositions.forEach((seat:typeOfSeat) => {
          //const isSelected = selectedSeats.some((selectedSeat:any) => selectedSeat.x === seat.x && selectedSeat.y === seat.y);
          if (seat.id == place){
            drawSeat(seat.posX+marginLeft, seat.posY+marginTop, !ticket.boughtPlaces.includes(seat.id), selectedSeats.includes(seat.id) , ticket.pendingPlaces.includes(seat.id), ticket.amount <= ticket.selected)
          }
        });
      })
    });
  };
  drawSeats();
  drawStage();
}

  React.useEffect(() => {
    render();
  }, [selectedSeats, ]);


  const handleSeatClick = (x:number, y:number) => {
    console.log(x,y);
    const clickedSeat = seatPositions.find((seat:any) => seat.posX+marginLeft <= x && x <= seat.posX+seatSize+marginLeft && seat.posY+marginTop <= y && y <= seat.posY+seatSize+marginTop);
    console.log(clickedSeat);
    if (clickedSeat && clickedSeat.id) {
      console.log(clickedSeat.id);
      selectFunction(clickedSeat.id);
      //setSelectedSeats((prevSelectedSeats:any) => [...prevSelectedSeats, clickedSeat]);
    }
    render();
    
  };

  return <canvas ref={canvasRef} width={sizeOfArea.width+2*marginLeft} height={sizeOfArea.height+2*marginTop} onClick={(e) => handleSeatClick(e.nativeEvent.offsetX, e.nativeEvent.offsetY)} />;
};

export default SeatVisualization;
