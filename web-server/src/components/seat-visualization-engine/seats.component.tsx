import React, { useState, useEffect } from "react";
import drawSeat from "./drawSeat";
import Loader from "../loader/loader.component";
import "../../css/seat-engine.css";
import { Spin } from "antd";
import { MapInteractionCSS } from "react-map-interaction";
import typeOfStage from "./types/typeOfStage";
import drawStage from "./drawStage";



type typeOfSeatPostions = {
  x: number;
  y: number;
  isAvailable: boolean;
};

type typeOfPlaces = {
  background: { isImage: boolean; name: "string" };
  colorOfBackground: string;
  colorOfSeat: string;
  seatsDatas: Array<typeOfSeat>;
  sizeOfArea: { width: number; height: number };
  sizeOfSeat: number;
  stage: number;
};

type typeOfSeat = {
  group: string;
  id: string;
  name: string;
  x: number;
  y: number;
  title: string;
  size: {
    width: number;
    height: number;
  };
  color: string;
};

type typeOfAmountTicket = {
  id: string;
  numberOfTicket: number;
  seats: Array<string>;
  price: number;
  name: string;
  ticketId: string;
  amount: number;
  selected: number;
  pendingPlaces: Array<string>;
  boughtPlaces: Array<string>;
  types: any
};

type typeOfSeatVisualizationParams = {
  seatPositions: Array<typeOfSeat>;
  sizeOfArea: { width: number; height: number };
  colorOfSeat: string;
  seatSize: number;
  tickets: Array<typeOfAmountTicket>;
  selectedSeats: Array<string>;
  selectFunction: Function;
  sizeOfScale?: number;
  disabled?: boolean;
  stages?: Array<typeOfStage>;
};

const getTotalAmountOfSeatsInACategorie = (types:Array<any>)=>{
  let amount = 0;
  types.forEach(type=>{
    amount += type.amount;
  });
  return amount
};

const SeatVisualization = ({
  seatPositions,
  sizeOfArea,
  colorOfSeat,
  seatSize,
  tickets,
  selectedSeats,
  selectFunction,
  sizeOfScale,
  disabled,
  stages,
}: typeOfSeatVisualizationParams) => {
  const canvasRef: any = React.useRef(null);
  const divRef: any = React.useRef(null);
  const [progress, setProgress] = useState(false);
  const [scale, setScale] = useState(sizeOfScale ? sizeOfScale : 1);
  const [state, setState] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });
  const animationRef: any = React.useRef(null);
  const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });
  const [currentTouch, setCurrentTouch] = useState({ x: 0, y: 0 });
  const [isZoomingOrMoving, setIsZoomingOrMoving] = useState(false);
  const [touchEvent, setTouchEvent] = useState<any>(null);

  const handleTouchStart = (e:any) => {
    setStartTouch({ x: state.translation.x, y: state.translation.y });
    setTouchEvent(e);
  };
  const handleTouchMove = (e:any) => {
    setCurrentTouch({ x: state.translation.x, y: state.translation.y });

    const deltaX = currentTouch.x - startTouch.x;
    const deltaY = currentTouch.y - startTouch.y;

    const threshold = 10;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      setIsZoomingOrMoving(true);
    }
  };

  // onTouchEnd handler
  const handleTouchEnd = (handleClick:Function) => {
    setStartTouch({ x: 0, y: 0 });
    setCurrentTouch({ x: 0, y: 0 });
    setIsZoomingOrMoving(false);
    if (!isZoomingOrMoving) {
      handleClick(touchEvent);
    }
  };

  const animateTransform = (targetTransform: any, startTransform: any) => {
    cancelAnimationFrame(animationRef.current);

    const duration = 500; // Adjust the animation duration in milliseconds
    const startTime = performance.now();

    const animate = (currentTime: any) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const newScale =
        startTransform.scale +
        progress * (targetTransform.scale - startTransform.scale);
      const newTranslation = {
        x: startTransform.translation.x,
        y: startTransform.translation.y,
      };

      setState({
        scale: newScale,
        translation: newTranslation,
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };
  const render = () => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //return place === seat.id ? <Seat marginLeft = {getMinX()/2} marginTop = {marginTop} color={places.colorOfSeat} seat={seat} size = {places.sizeOfSeat} classname = {!ticket.boughtPlaces.includes(seat.id) ? !ticket.pendingPlaces.includes(seat.id) ? ticket.amount > 0 ? seleted.includes(seat.id) ? "user-selected"  : ticket.selected >= ticket.amount ? "user-disabled" : "user-allowed" : "user-disabled" : "user-pending" : "user-bought"} onClickFunction = {onClickFunction} /> : "";

    const drawSeats = () => {
      ctx.clearRect(0, 0, sizeOfArea.width, sizeOfArea.height);
      if (tickets) {
        tickets.forEach((ticket) => {
          ticket.seats.forEach((place) => {
            //const isSelected = selectedSeats.some((selectedSeat:any) => selectedSeat.x === seat.x && selectedSeat.y === seat.y);
            let seat = seatPositions.find((pos) => pos && pos.id == place);
            if (seat && seat.id == place) {
              drawSeat(
                seat.x * scale,
                seat.y * scale,
                !ticket.boughtPlaces.includes(seat.id),
                selectedSeats.includes(seat.id),
                ticket.pendingPlaces.includes(seat.id),
                getTotalAmountOfSeatsInACategorie(ticket.types) <= ticket.selected,
                ctx,
                seat.size.width,
                seat.size.height,
                seat.color,
              );
            }
          });
        });
      }
      if (stages) {
        stages.forEach((stage) => {
          drawStage(
            stage.x * scale,
            stage.y * scale,
            stage.width,
            stage.height,
            ctx,
          );
        });
      }
    };
    drawSeats();
    //drawStage();
  };

  React.useEffect(() => {
    render();
  }, [selectedSeats, tickets]);

  useEffect(() => {
    let lstate = { ...state };
    let area = sizeOfArea;
    let windowWidth = window.innerWidth * .8 < 500 ? window.innerWidth * .8 : 500;
      lstate.scale =
        (window.innerHeight - 180) / area.height >
        windowWidth / area.width
          ? windowWidth / area.width
          : (window.innerHeight - 180) / area.height;
          lstate.translation.x = (windowWidth - lstate.scale*area.width)/2;
    setState(lstate);
  }, []);

  const getMinMaxCoordinatesByGroup = (dataArray: typeOfSeat[]) => {
    const minMaxCoordinatesByGroup: Record<
      string,
      { minX: number; minY: number; maxX: number; maxY: number }
    > = {};

    dataArray.forEach((item) => {
      const { group, x, y } = item;

      if (!minMaxCoordinatesByGroup[group]) {
        // If the group is not yet in the result object, initialize it
        minMaxCoordinatesByGroup[group] = {
          minX: x,
          minY: y,
          maxX: x,
          maxY: y,
        };
      } else {
        // Update the min/max values if the current item has lower/higher values
        minMaxCoordinatesByGroup[group].minX = Math.min(
          minMaxCoordinatesByGroup[group].minX,
          x,
        );
        minMaxCoordinatesByGroup[group].minY = Math.min(
          minMaxCoordinatesByGroup[group].minY,
          y,
        );
        minMaxCoordinatesByGroup[group].maxX = Math.max(
          minMaxCoordinatesByGroup[group].maxX,
          x,
        );
        minMaxCoordinatesByGroup[group].maxY = Math.max(
          minMaxCoordinatesByGroup[group].maxY,
          y,
        );
      }
    });

    return minMaxCoordinatesByGroup;
  };

  const controlZoom = ({
    minX,
    minY,
    maxX,
    maxY,
  }: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }) => {
    let lstate = { ...state };
    let area = sizeOfArea;
    let width = maxX - minX;
    let height = maxY - minY;
    let windowHeight = window.innerHeight - 180;
    let windowWidth = window.innerWidth * 0.8 < 500 ? window.innerWidth * 0.8 : 500;
    if (height < windowHeight || width < windowWidth) {
      lstate.scale =
        (windowHeight / height > windowWidth / width
          ? windowWidth / width
          : windowHeight / height) * 0.8;
    }
    if (
      state.scale * 2 < lstate.scale ||
      Math.ceil(-minX * lstate.scale) +
        Math.ceil(windowWidth - width * lstate.scale) / 2 <
        state.translation.x - windowWidth / 2 ||
      Math.ceil(-minX * lstate.scale) +
        Math.ceil(windowWidth - width * lstate.scale) / 2 -
        windowWidth / 2 >
        state.translation.x
    ) {
      lstate.translation.x =
        Math.ceil(-minX * lstate.scale) +
        Math.ceil(windowWidth - width * lstate.scale) / 2;
      lstate.translation.y =
        Math.ceil(-minY * lstate.scale) +
        Math.ceil(windowHeight - height * lstate.scale) / 2;
      let startState = {
        scale: state.scale,
        translation: { x: lstate.translation.x, y: lstate.translation.y },
      };
      animateTransform(lstate, startState);
    }
  };

  const handleSeatClick = (x: number, y: number) => {
    if (!disabled) {
      //let sizeOfGroups:any = (getMinMaxCoordinatesByGroup(seatPositions));
      const clickedSeat = seatPositions.find(
        (seat: any) =>
          seat &&
          seat.x <= x &&
          x <= seat.x + seat.size.width &&
          seat.y <= y &&
          y <= seat.y + seat.size.height,
      );
      if (clickedSeat) {
        //controlZoom(sizeOfGroups[clickedSeat.group])
      }
      if (clickedSeat && clickedSeat.id) {
        let ticket = tickets.find(ticket=>ticket.seats.includes(clickedSeat.id));
        if (!ticket?.pendingPlaces.includes(clickedSeat.id) && !ticket?.boughtPlaces.includes(clickedSeat.id))
        selectFunction(clickedSeat.id);
        //setSelectedSeats((prevSelectedSeats:any) => [...prevSelectedSeats, clickedSeat]);
      }
      setProgress(false);
      render();
    }
  };

  /*
  width:
          window.innerWidth * 0.8 > sizeOfArea.width
            ? sizeOfArea.width
            : window.innerWidth * 0.8,*/

  return (
    <div
      className = "map-holder-div"
      ref={divRef}
      style={{
        position: "relative",
        zIndex: "max",
        
        height:
          window.innerHeight - 180 > sizeOfArea.height
            ? sizeOfArea.height
            : window.innerHeight - 180,
      }}
    >
      <MapInteractionCSS
        value={state}
        onChange={(value: any) => setState(value)}
        controlsClass="zoom-tool-button"
        minScale={0.3}
        maxScale={2.5}
        className="map-container"
        translationBounds={{
          xMax: sizeOfArea.width * 1.5,
          yMax: sizeOfArea.height * 1.5,
          xMin: -sizeOfArea.width * state.scale * 0.9,
          yMin: -sizeOfArea.height * state.scale * 0.9,
        }}
      >
        {!progress ? (
          <Spin size="large" spinning={disabled ? disabled : false}>
            <div id="seat-map-canvas-holder" className="seat-map-canvas-holder">
              <canvas
                onTouchStart={e=>handleTouchStart(e)}
                onTouchMove={e=>handleTouchMove(e)}
                onTouchEnd={e=>handleTouchEnd((e: any) => {
                  handleSeatClick(
                    (e.touches[0].pageX -
                      canvasRef.current.getBoundingClientRect().left) *
                      (1 / state.scale),
                    (e.touches[0].pageY -
                      (document.documentElement.scrollTop +
                        canvasRef.current.getBoundingClientRect().top)) *
                      (1 / state.scale),
                  )})}
                onClick={(e: any) => {
                  handleSeatClick(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                }}
                style={{ zIndex: 2000 }}
                ref={canvasRef}
                width={sizeOfArea.width}
                height={sizeOfArea.height}
              />
              {disabled ? <div className="canvas-overlay"></div> : ""}
            </div>
          </Spin>
        ) : (
          <div style={{ width: sizeOfArea.width, height: sizeOfArea.height }}>
            <Loader />
          </div>
        )}
      </MapInteractionCSS>
    </div>
  );
};

export default SeatVisualization;

/*

  */
