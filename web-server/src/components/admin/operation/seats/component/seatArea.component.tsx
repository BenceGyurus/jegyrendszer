import { Children, useEffect, useRef, useState } from 'react';
import "../../../../../css/area.css";
import SelectDiv from '../../../../selecting-div/selecting_Div.component';
import Zoom from '../../../../zoom/zoom.component';
type BackgroundType = {
    name : string,
    isImage : boolean
}

type AreaParams = {
    width : number,
    height : number,
    background : BackgroundType
    children : JSX.Element,
    clickEvent : Function,
    size:number,
    posYOfArea:Function,
    posXOfArea:Function,
    action : "drag" | "select" | "zoom"
};

const Area = ({width, height, background, children, clickEvent, size, posYOfArea,posXOfArea, action}:AreaParams) =>{
    const [scale, setScale] = useState(1);
    const [zoomPos, setZoomPos]:[{x : number, y : number}, Function] = useState({x : 0, y : 0})
    const [selectedSeats, setSelectedSeats]:[Array<string>, Function] = useState([]);
    const classname = "seatArea";
    const mappedChildren = Children.map(children, child =>
        <div>
          {child}
        </div>
      );
    const handleClick = (event:any)=>{
        if (event.target.className == classname){
            clickEvent(event.pageX-size/2, event.pageY-size/2, "", "");
        }
    }
    const areaRef:any = useRef(null);

    useEffect(()=>{
        if (areaRef.current){
            posYOfArea(areaRef.current.offsetTop);
            posYOfArea(areaRef.current.offsetTop);
            posXOfArea(areaRef.current.offsetLeft);
        }
        
    })

    const selectSeats=(x:number,y:number,width:number,height:number)=>{
        
    }

    return (
        <div ref={areaRef} style = {{width : "max-content", display : "block", margin : "0px auto" , position: "relative"}}>
            {
        background.isImage ? <div><img src={background.name} crossOrigin='anonymous'  className = {classname}  style ={{width : `${width}px`, display : "block", margin : "0px auto"}} onClick = {event => handleClick(event)} />{mappedChildren}</div>
         : 
        <Zoom gotScale={scale} handleScale={setScale} isZoom = {action==="zoom"} width = {width} height = {height} setPos={setZoomPos} defaultPos={zoomPos} >
            <SelectDiv select = {action==="select"} posFromTop={areaRef?.current?.offsetTop} posFromLeft={areaRef?.current?.offsetLeft} selectFunction={()=>{}} className = {classname}  style ={{width : width, height : height, background : background.isImage ? `url("${background.name}"), cover;` : background.name, transform: `scale(${scale}) translate(${zoomPos.x}px, ${zoomPos.y}px)`,}} onClick = {action === "drag" ? (event:any) => handleClick(event) : ()=>{}}>
                {mappedChildren}
            </SelectDiv>
        </Zoom>
        }
        </div>
    );
}

//{children.map((child:any)=>{return child})}

export default Area;