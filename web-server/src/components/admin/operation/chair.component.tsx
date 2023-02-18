import { useState } from "react";
import Draggable from "react-draggable";
import 'react-tooltip/dist/react-tooltip.css'
const Chair = (params:any)=>{

    const [style, setStyle] = useState({
        top: params.posY-params.size/2,
        left: params.posX-params.size/2,
        width: params.size,
        height: params.size
    });

    let tooltipId = String(Math.ceil(Math.random()*9999999));

    return (    
        <Draggable onDrag={(event:any, data:any)=>{params.setPos(event.screenX, event.screenY,params.index)}}>
            <span data-tooltip-id={tooltipId} style={style} className = "chair" data-tooltip-content = {params.name} key = {params.id} onDoubleClick = {event=>params.onClickEvent(event,params.index)}>{params.title}<span className = "toolTipText">{params.name}</span></span>
        </Draggable>
    )
}

export default Chair;