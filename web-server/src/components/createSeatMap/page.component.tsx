import React, { useState, useEffect } from "react";
import "../../css/createMapPage.css";
import Box from "../selectingBox/box.component";
import typeOfSpaceBetween from "./type/spaceBetween";
import { v4 as uuid } from 'uuid';
import { Radio } from "antd";
import { DragOutlined, GroupOutlined, InsertRowAboveOutlined, SelectOutlined } from "@ant-design/icons";
import CreateingSettings from "./createingActionSettings.component";
import SelectingSettings from "./selectingActionSettings.component";
import typeOfSizeOfSeat from "./type/sizeOfSeat";
import typeOfArea from "./type/area";
import RenderSeats from "./renderSeats.component";
import typeOfSeat from "./type/seat";
import Drag from "../drag/drag.component";
import TransformsSettings from "./transformsSettings.component";
import stairsTransform from "./stairsTransform";
import findCommonPrefix from "./findCommonPrefix";
import typeOfGroup from "./type/group";
import GroupsSettings from "./goupsSettings.component";
import SeatList from "./seatList.component";


const Page = ()=>{
    
    const [action, setAction] = useState<"select" | "create" | "groups" | "drag">("create");
    const [sizeOfSeat, setSizeOfSeat] = useState<typeOfSizeOfSeat>({height : 10, width : 12});
    const [spaceBetween, setSpaceBetween] = useState<typeOfSpaceBetween>({x : 2, y : 10});
    const [area, setArea] = useState<typeOfArea>({startX : 0, startY : 0, endPosX : 0, endPosY : 0, width : 0, height : 0});
    const [seats, setSeats] = useState<Array<typeOfSeat>>([]);
    const [groups, setGroups]:[Array<typeOfGroup>, Function] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState<Array<string>>([]);
    const [steps, setSteps] = useState<{groups : Array<typeOfGroup>, seats : typeOfSeat}>();
    const [amountOfStairs, setAmountOfStairs] = useState<number>(10);
    const [stairs, setStairs] = useState(false);
    const [nameOfPosition, setNameOfPosition] = useState("");
    const [nameOfCoulmn, setNameOfCoulmn] = useState("");
    const [nameOfSeat, setNameOfSeat] = useState("");
    const [nameOfSelectedSeats, setNameOfSelectedSeats] = useState("");
    const [selectedGroups, setSelectedGroups] = useState<Array<string>>([]);
    const [isRomanicTheRow, setIsRomanicTheRow] = useState(false);
    const [isRomanicSeatNumber, setIsRomanicSeatNumber] = useState(false);
    const [dicretcion, setDicretcion] = useState(false);     //left : true, right : false

    const romanize = (num:number) => {
      var lookup:any = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
      for ( i in lookup ) {
        while ( num >= lookup[i] ) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    }


    const darkenRGBColor=(rgbColorString: string, amount: number): string => {
      const colorMatch = rgbColorString.match(/(\d+), (\d+), (\d+)/);
      
      if (colorMatch) {
        let [_, rString, gString, bString] = colorMatch;
        
        // Parse the color components as integers
        let r = parseInt(rString);
        let g = parseInt(gString);
        let b = parseInt(bString);
        r = Math.max(r - amount, 0);
        g = Math.max(g - amount, 0);
        b = Math.max(b - amount, 0);
        const modifiedColor = `rgb(${r}, ${g}, ${b})`;
        return modifiedColor;
      } else {
        return rgbColorString;
      }
    }

    const generateRandomColor = ()=> {
      const maxColorComponentValue = 220;
      return `rgb(${Math.floor(Math.random() * maxColorComponentValue)}, ${Math.floor(Math.random() * maxColorComponentValue)}, ${Math.floor(Math.random() * maxColorComponentValue)})`;
    }

    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Backspace') {
            if (selectedSeats.length){
              let l = [...seats];
              l = l.filter(seat=> !selectedSeats.includes(seat.id));
              setSeats(l);
            }
          }
          if (event.metaKey && event.key === 'z') {
            undo();
          } else if (event.ctrlKey && event.key === 'z') {
            undo();
          }

        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [seats, selectedSeats]); 


      const undo = ()=>{
        
      }

      console.log(groups);


      const createNewSeats = ()=>{
        let l:Array<typeOfSeat> = [...seats];
        setNameOfPosition("");
        let group:string = uuid();
        for (let i = 0; i < Math.floor((area.width+2*spaceBetween.x)/(sizeOfSeat.width+spaceBetween.x)); i++){
          for (let j = 0; j < Math.floor((area.height+2*spaceBetween.y)/(sizeOfSeat.height+spaceBetween.y)); j++){
            l.push({y :  area.startY+j*(sizeOfSeat.height+spaceBetween.y)+ 80, x : area.startX+i*(sizeOfSeat.width+spaceBetween.x), width : sizeOfSeat.width, height : sizeOfSeat.height, name : `${nameOfPosition} ${ isRomanicTheRow ? romanize(j+1) : j+1}. ${nameOfCoulmn} ${ isRomanicSeatNumber ? romanize(i+1) : i+1}. ${nameOfSeat}`, id : uuid(), group : group });
          }
        }
        setGroups([...groups ,{name: nameOfPosition ? nameOfPosition : "Névtelen csoport", id : group, color : generateRandomColor()}]);
        setSelectedSeats([]);
        setSeats(l);
      }

      console.log(seats);
      const selecting = ()=>{
          let l = [...seats];
          let selected = l.filter((seat)=> area.startX <= seat.x && area.startY <= seat.y-80 && area.startX+area.width-seat.width >= seat.x && area.startY+area.height-seat.height >= seat.y-80);
          setSelectedSeats(selected.map((s)=>{return s.id}));
          setNameOfSelectedSeats(findCommonPrefix(selected, "name"));
      }

      const changeSelectedPos = ({dx,dy, x,y}:{dx : number, dy : number, x : number, y : number})=>{
          console.log(dx, dy);
          let l = [...seats];
          l.forEach((seat, index)=>{
            if (selectedSeats.includes(seat.id)){ l[index].x -= dx; l[index].y -= dy}
          });
          console.log(l);
          setSeats(l);
      }

      const incrementStairs = ()=>{
        setSeats([...seats.filter(seat=>!selectedSeats.includes(seat.id)), ...stairsTransform(seats.filter(seat=>selectedSeats.includes(seat.id)), amountOfStairs)]);
      }

      const decrementStaris = ()=>{
        setSeats([...seats.filter(seat=>!selectedSeats.includes(seat.id)), ...stairsTransform(seats.filter(seat=>selectedSeats.includes(seat.id)), -1*amountOfStairs)]);
      }


    return (<div className = "create-map-page">
        <div className = "seat-map">
           {
            action === "create" ? <Box endFunction={createNewSeats} width={window.innerWidth*.7} height={window.innerHeight-80} boxChildren={<RenderSeats area={area} sizeOfSeat={sizeOfSeat} spaceBetween={spaceBetween} />} setArea={setArea} style = {{cursor : "crosshair", width : window.innerWidth*.7, height : window.innerHeight-80, position : "absolute"}} ></Box> : action === "select" ? <Box  width={window.innerWidth*.7} height={window.innerHeight-80} boxStyle={{background : "rgba(130, 213, 255,0.5)", border : "1px solid rgba(130, 213, 255,1)"}} style = {{ cursor : "cell" , width : window.innerWidth*.7, height : window.innerHeight-80, position : "absolute"}} setArea={setArea} selectingFunction={selecting} startFunction={selecting} endFunction={()=>{setAction("drag")}} ></Box> : <Drag style={{cursor : "grab"}} startFunction={console.log} onDragFunction={changeSelectedPos} width={window.innerWidth*.7} height = {window.innerHeight-80} ></Drag>
           }
           <div>
              <SeatList seats={seats} groups={groups} selectedSeats={selectedSeats} onClickFunction={()=>{console.log("click")}} />
            </div>
        </div>
        <div className = "create-map-settings">
            <div className = "action-settings-selector"><Radio.Group optionType="button" buttonStyle="solid" options={[{label : <SelectOutlined />, value : "select"}, {label : <InsertRowAboveOutlined />, value : "create"}, {label : <GroupOutlined />, value : "groups"}, {label : <DragOutlined />, value : "drag"}]} onChange={e=>setAction(e.target.value)} value={action} /></div>
            {
                action === "create" ? <CreateingSettings isRomanicSeatNumber = {isRomanicSeatNumber} setIsRomanicSeatNumber={setIsRomanicSeatNumber} isRomanicTheRow = {isRomanicTheRow} setIsRomanicTheRow={setIsRomanicTheRow} seats={seats} groups={groups} nameOfCoulmn={nameOfCoulmn} setNameOfCoulmn={setNameOfCoulmn} nameOfPosition={nameOfPosition} setNameOfPosition={setNameOfPosition} nameOfSeat={nameOfSeat} setNameOfSeat={setNameOfSeat}   sizeOfSeat={sizeOfSeat} spaceBetween={spaceBetween} setSizeOfSeat={setSizeOfSeat} setSizeOfBetween={setSpaceBetween} /> : action === "drag" ? <TransformsSettings incrementStairs={incrementStairs} decrementStairs={decrementStaris} /> : action === "groups" ? <GroupsSettings seats={seats} groups={groups} setGroups={setGroups} /> : <SelectingSettings value = {nameOfSelectedSeats} />
            }
        </div>
    </div>);
}

export default Page;


/*
{
              seats.map(seat=>{
                return !selectedSeats.includes(seat.id) ? <span style={{borderRadius : "15%", position : "absolute", top : seat.y, left : seat.x, width : seat.width, height : seat.height, display : "inline-flex", background :  groups ? groups.find(group=>group.id===seat.group)?.color : "black"}}></span> :   <span key={seat.id} id={seat.id} style = {{ position : "absolute", width : seat.width, height : seat.height, display : "inline-flex", background : "#82d5ff", top : seat.y , left : seat.x}} ></span> 
              })
            }*/


/*



import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';



function App() {
  return (
    <DndProvider backend={Backend}>
      {Array.from({ length: 5 }, (_, i) => (
       
      ))}
    </DndProvider>
  );
}

export default App;
*/


//? "#82d5ff"