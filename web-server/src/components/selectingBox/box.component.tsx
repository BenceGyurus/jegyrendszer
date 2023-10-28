import { useState } from "react";
import typeOfBoxParams from "./type/boxParams";
import typeOfEventPos from "./type/eventPos";
import "../../css/box.css";

const Box = ({children, boxChildren, style, className, width, height, setArea, startFunction, endFunction, boxStyle, boxClassName, selectingFunction}:typeOfBoxParams)=>{

    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [startPos, setStartPos] = useState<typeOfEventPos>({x : 0, y : 0});
    const [top, setTop] = useState<boolean>(true);
    const [pos, setPos] = useState<typeOfEventPos>({x : 0, y : 0});
    const [left, setLeft] = useState<boolean>(true);

    const startSelecting = (e:React.MouseEvent<HTMLDivElement>)=>{
        setIsSelecting(true);
        setStartPos({x : e.pageX, y : e.pageY-80});
        setPos({x : e.pageX, y : e.pageY-80});
        if (startFunction) startFunction(e);
        if (setArea) setArea({startX : left ? startPos.x : e.pageX, startY : top ? startPos.y : e.pageY-80, endX : left ? e.pageX : startPos.x, endY : top ? e.pageY-80 : startPos.y-80, width : 0, height : 0});
    }

    const mouseMoveEvent = (e:React.MouseEvent<HTMLDivElement>)=>{
        if (isSelecting){
        setPos({x : e.pageX, y : e.pageY-80});
        e.pageX < startPos.x ? setLeft(false) : setLeft(true);
        e.pageY-80 < startPos.y ? setTop(false) : setTop(true);
        if (setArea) setArea({startX : left ? startPos.x : e.pageX, startY : top ? startPos.y : e.pageY-80, endX : left ? e.pageX : startPos.x, endY : top ? e.pageY-80 : startPos.y-80, width : Math.abs(startPos.x-e.pageX), height : Math.abs(startPos.y-e.pageY+80)});
        if (selectingFunction) selectingFunction();
        }
    }

    const endSelecting = (e:React.MouseEvent<HTMLDivElement>)=>{
        setIsSelecting(false);
        if (endFunction) endFunction(e);
    }

    const getStyle = ()=>{
        console.log(width-startPos.x);
        let styleParams:{top? : number, bottom? : number, left? : number, right? : number, width : number, height : number} = {width : 0, height : 0};
        styleParams[top ? "top" : "bottom"] = top ?  startPos.y : height - startPos.y
        styleParams[left ? "left" : "right"] = left ? startPos.x : width - startPos.x;
        styleParams.width = Math.abs(startPos.x-pos.x);
        styleParams.height = Math.abs(startPos.y-pos.y);
        return styleParams
    }

    return (<div
        style={{...style}}
        className={`${className}`}
        onMouseDown={e=>startSelecting(e)}
        onMouseMove={e=>mouseMoveEvent(e)}
        onMouseUp={e=>endSelecting(e)}
    >

        {isSelecting ? <div style={{
            position : "absolute",
            ...getStyle(),
            ...boxStyle
            
        }} className={boxClassName}>
            {boxChildren}
        </div> : <></>}

        {children}

    </div>)
}

export default Box;