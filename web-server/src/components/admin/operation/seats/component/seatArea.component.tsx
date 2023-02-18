import { Children } from 'react';
type BackgroundType = {
    name : string,
    isImage : boolean
}
type AreaParams = {
    width : number,
    height : number,
    background : BackgroundType
    children : any,
    clickEvent : any
};

const Area = ({width, height, background, children, clickEvent}:AreaParams) =>{
    const classname = "seatArea";
    const mappedChildren = Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      );
    const handleClick = (event:any)=>{
        if (event.target.className == classname){
            clickEvent(event.clientX, event.clientY, "", "");
        }
    }
    return (
        <div className = {classname}  style ={{width : `${width}px`, height : `${height}px`, background : background.isImage ? `url("${background.name}")` : background.name}} onClick = {event => handleClick(event)}>
            {mappedChildren}
        </div>
    );
}

//{children.map((child:any)=>{return child})}

export default Area;