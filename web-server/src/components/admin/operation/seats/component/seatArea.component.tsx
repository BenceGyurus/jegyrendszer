import { Children, useEffect, useRef } from 'react';
import "../../../../../css/area.css";
type BackgroundType = {
    name : string,
    isImage : boolean
}

type AreaParams = {
    width : number,
    height : number,
    background : BackgroundType
    children : any,
    clickEvent : any,
    size:number,
    posYOfArea:Function,
    posXOfArea:Function
};

const Area = ({width, height, background, children, clickEvent, size, posYOfArea,posXOfArea}:AreaParams) =>{
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

    return (
        <div ref={areaRef} style = {{left : (window.innerWidth/2)-width/2, position: "relative"}}>
            {
        background.isImage ? <div><img src={background.name} crossOrigin='anonymous'  className = {classname}  style ={{width : `${width}px`, height : `${height}px`, position: "relative"}} onClick = {event => handleClick(event)} />{mappedChildren}</div>
         : 
        <div className = {classname}  style ={{width : `${width}px`, height : `${height}px`, background : background.isImage ? `url("${background.name}"), cover;` : background.name}} onClick = {event => handleClick(event)}>
            {mappedChildren}
        </div>
        }
        </div>
    );
}

//{children.map((child:any)=>{return child})}

export default Area;