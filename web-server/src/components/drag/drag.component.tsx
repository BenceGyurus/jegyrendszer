import { useState } from "react";
import typeOfPos from "./type/pos";
import typeOfDragParams from "./type/dragParams";

const Drag = ({width, height, style, startFunction, endFunction, onDragFunction}:typeOfDragParams)=>{

    const [startPos, setStartPos] = useState<typeOfPos>({x : 0, y : 0});
    const [pos, setPos] = useState<typeOfPos>({x : 0, y : 0});
    const [onDragging, setOnDragging] = useState<boolean>(false);

    const startSelecting = (e:React.MouseEvent<HTMLDivElement>)=>{
        setStartPos({x : e.pageX, y : e.pageY});
        setPos({x : e.pageX, y : e.pageY});
        setOnDragging(true);
        if (startFunction) startFunction({dx : 0, dy : 0, x : e.pageX, y : e.pageY});
    }

    const mouseMoveEvent = (e:React.MouseEvent<HTMLDivElement>)=>{
        if (onDragging){
            if (onDragFunction) onDragFunction({dx : pos.x-e.pageX, dy : pos.y-e.pageY, x : e.pageX, y : e.pageY});
            setPos({x : e.pageX, y : e.pageY});
        }
    }

    const endSelecting = (e:React.MouseEvent<HTMLDivElement>)=>{
        setOnDragging(false);
        if (endFunction) endFunction({dx : startPos.x-e.pageX, dy : startPos.y-e.pageY, x : e.pageX, y : e.pageY});
    }

    console.log(ondrag);

    return (<div 
        onMouseDown={e=>startSelecting(e)}
        onMouseMove={e=>mouseMoveEvent(e)}
        onMouseUp={e=>endSelecting(e)}
        onClick={e=>{if (onDragging) endSelecting(e)}}
        style={{width : width, height : height, ...style}}>
        </div>);
}

export default Drag;