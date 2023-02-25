import { Children } from 'react';
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
    size:number
};

const Area = ({width, height, background, children, clickEvent, size}:AreaParams) =>{
    const classname = "seatArea";
    const mappedChildren = Children.map(children, child =>
        <div>
          {child}
        </div>
      );
    const handleClick = (event:any)=>{
        if (event.target.className == classname){
            console.log(event)
            clickEvent(event.pageX-size/2, event.pageY-size/2, "", "");
        }
    }
    return (
        <div>
            {
        background.isImage ? <div><img src={background.name} crossOrigin='anonymous'  className = {classname}  style ={{width : `${width}px`, height : `${height}px`}} onClick = {event => handleClick(event)} />{mappedChildren}</div>
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