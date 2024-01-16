import typeOfTableParams from "./type/table";
import "../../css/createSeatMapTable.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MapInteractionCSS } from "react-map-interaction";
import React, { useState } from "react";
import SeatList from "./seatList.component";
import SelectDiv from "../selecting-div/selecting_Div.component";
import Box from "../selectingBox/box.component";
import typeOfArea from "./type/areaType";
import Drag from "../drag/drag.component";
import StageList from "./stageList.component";
import { v4 as uuid } from 'uuid';

const CreateSeatMapTable = ({seats, background, status, widthOfSeats, heightOfSeats, spaceBetweenTheSeats, spaceUnderTheSeats, area, setArea, newSeats, state, setState, selectedSeats, setSelectedSeats, dragSelectedSeats, setSelectedSeat, watchingGroup, originalColor, isSector, stages, setError}:typeOfTableParams)=>{

  const [selectBox, setSelectionBox]:any = useState();


  const styleOfDragBox:React.CSSProperties = {
    position : "absolute", 
    top : 80, 
    display: "block"
  }


    const restartMap = ()=>{
      setState({
        scale : 1,
        translation : {x : 0, y : 0}
      })
    }

    const createSeats = ()=>{
      newSeats((1/state.scale)*((area.width)/((widthOfSeats+spaceBetweenTheSeats))), (1/state.scale)*((area.height)/((heightOfSeats+spaceUnderTheSeats))));
    }


    const selectFunction = ()=>{
      let l:Array<string> = [];
      if (seats){
      for (let i = 0; i < seats.length; i++){
        if (seats[i] && seats[i].seats){
          for (let k = 0; k < seats[i].seats.length; k++){
            if (seats[i].seats[k]){
            for (let j = 0; j < seats[i].seats[k].length; j++){
            if ((seats[i].seats[k][j].x)+(seats[i].seats[k][j].size.width/2) >= ((selectBox.startX)-(state.translation.x))*(1/state.scale) && (seats[i].seats[k][j].x)+(seats[i].seats[k][j].size.width/2) <= ((selectBox?.endX)-(state.translation.x))*(1/state.scale) && (seats[i].seats[k][j].y)+(seats[i].seats[k][j].size.height/2) >= ((selectBox?.startY)-(state.translation.y))*(1/state.scale) && (seats[i].seats[k][j].y)+(seats[i].seats[k][j].size.height/2) <= ((selectBox?.endY)-(state.translation.y))*(1/state.scale)){
              l.push(seats[i].seats[k][j].id);
            }
          }
          }
          }
      }
      }
      }
      if (stages){
        stages.filter(stage=>{return stage.x >= (selectBox.startX-state.translation.x)*(1/state.scale) && (stage.x) <= ((selectBox?.endX)-(state.translation.x))*(1/state.scale) && stage.y >= ((selectBox?.startY)-(state.translation.y))*(1/state.scale) && stage.y <= ((selectBox?.endY)-(state.translation.y))*(1/state.scale) }).forEach(j=>l.push(j.id));
      }
      setSelectedSeats(l);
    }

    const generate_Seats = ()=>{
      let elements:Array<JSX.Element> = [];
      if (isSector){for (let i = 0; i < (1/state.scale)*((area.width)/((widthOfSeats+spaceBetweenTheSeats))); i++){
        for (let j = 0; j < (1/state.scale)*((area.height)/((heightOfSeats+spaceUnderTheSeats))); j++){
          elements.push(<span key = {uuid()} className = "editing-seat" style={{height : heightOfSeats, width : widthOfSeats, position : "absolute", left : i*((widthOfSeats)+spaceBetweenTheSeats), top : j*((heightOfSeats)+spaceUnderTheSeats) }}></span>);
        }
      }
      return <>
        <span style = {{fontSize : 15*(1/state.scale), top : -20*(1/state.scale), left : -5*(1/state.scale)}}  className = "size-of-seat-box-span">{Math.floor((1/state.scale)*((area.height)/((heightOfSeats+spaceUnderTheSeats))))+1}x{Math.floor((1/state.scale)*((area.width)/((widthOfSeats+spaceBetweenTheSeats))))+1}</span>
        {elements}
      </>}
      else{
        return <div style={{position: "absolute", background : "black", left : 0, top: 0, width : area.width*(1/state.scale), height : area.height*(1/state.scale)}}></div>
      }

      /*
      for (let i = 0; i < (area.width*(1/state.scale))/((widthOfSeats+spaceBetweenTheSeats)*state.scale); i++){
        for (let j = 0; j < (area.height*(1/state.scale))/((heightOfSeats+spaceUnderTheSeats)*state.scale); j++){
          elements.push(<span className = "editing-seat" style={{height : heightOfSeats*(state.scale), width : widthOfSeats*(state.scale), position : "absolute", left : i*((widthOfSeats)+spaceBetweenTheSeats)*(state.scale), top : j*((heightOfSeats)+spaceUnderTheSeats)*(state.scale) }}></span>);
        }
      }
      return <>
        <span style = {{fontSize : 15*(1/state.scale), top : -20*(1/state.scale), left : -5*(1/state.scale)}}  className = "size-of-seat-box-span">{Math.floor((area.height*(1/state.scale))/((heightOfSeats+spaceUnderTheSeats)*state.scale))+1}x{Math.floor((area.width*(1/state.scale))/((widthOfSeats+spaceBetweenTheSeats)*state.scale))+1}</span>
        {elements}
      </>*/
    };



    return (
        <div className = "create-seat-map-table" style={{width : window.innerWidth*.7}}>
          <div className = "create-map-actions">
            <span>{Math.round(state.scale * 100) / 100}x</span>
            <button onClick = {(e)=>{ restartMap() }} className = "create-seat-map-table-restart-button"><i className="fas fa-redo"></i></button>
          </div>
        <MapInteractionCSS
        
        disablePan = {status!=="move"}
        disableZoom = {status !== "move"}
        showControls = {true}
        value={state}
        onChange={(value:any) => setState(value)}
        controlsClass = "zoom-tool-button"
        minScale = {0.1}
        maxScale = {2}
        > 
        <div className = "table-item-box">
          <Box endFunction={selectFunction} boxStyle={{zIndex : 10}} setArea={setSelectionBox} scale={state.scale} scalePos={state.translation} style = {{width : window.innerWidth*.7, height : window.innerHeight-80, cursor : "auto"}} selectingFunction={selectFunction} className="selectbox" boxClassName="selecting-box" width={window.innerWidth*.7} height = {window.innerHeight-80} selecting = {status === "edit"} >
              <Box boxStyle={{zIndex : 10}} endFunction={createSeats} setArea={setArea} startFunction={()=>{}} scale={state.scale} scalePos={state.translation} selectingFunction={()=>{}} width={window.innerWidth*.7} height={window.innerHeight-80} style={{width : window.innerWidth*.7, height : window.innerHeight-80, position:"absolute"}} boxChildren={generate_Seats()} selecting = {status === "create"}>
              { status === "drag" ?  <Drag style={styleOfDragBox} width={window.innerWidth*.7} height = {window.innerHeight-80} startFunction={()=>{}} onDragFunction={dragSelectedSeats} endFunction={()=>{}} /> : <></>}
              {background ? <img src={background} alt="hattérkép" /> : <></>}
              <SeatList originalColor = {originalColor} watchingGroup={watchingGroup} onClickFunction = {setSelectedSeat} selectedSeats={selectedSeats} seats={seats} />
              <StageList stages={stages} selectedSeats={selectedSeats} />
              </Box>
          </Box>
        </div>
      </MapInteractionCSS>
    </div>
    )
}



/*
<TransformWrapper
      initialScale={1.4}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <div className="tools">
            <button className="zoom-tool-button zoom-in-button" onClick={() => zoomIn()} ><i className="fas fa-search-plus" ></i></button>
            <button className="zoom-tool-button reset-button" onClick={() => resetTransform()}><i className="fas fa-sync"></i></button>
            <button className="zoom-tool-button zoom-out-button" onClick={() => zoomOut()}><i className="fas fa-search-minus"></i></button>
          </div>
          <TransformComponent>
            <div className = "create-seat-map-items">
                {
                    seats.map((row)=>{
                        return row.map((column)=>{
                            return <div></div>;
                        })
                    })
                }
            </div>
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>*/
export default CreateSeatMapTable;