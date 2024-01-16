import { useState, useRef } from "react";
import typeOfSelectDivParams from "./type/selectDivParams";
import "../../css/selectingBox.css";


interface SelectionBox {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }

const SelectDiv = ( { children, selectFunction, className, style, onClick, posFromTop, posFromLeft, select }:typeOfSelectDivParams )=>{
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsSelecting(true);
        const { pageX, pageY } = e;
        setSelectionBox({ left: pageX - (posFromLeft ? posFromLeft : 0), top: pageY - (posFromTop ? posFromTop : 0), right: pageX - (posFromLeft ? posFromLeft : 0), bottom: pageY - (posFromTop ? posFromTop : 0) });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isSelecting) {
            const { pageX, pageY } = e;
            setSelectionBox((prevSelectionBox) => (prevSelectionBox ?{
            left: Math.min(prevSelectionBox.left, pageX - (posFromLeft ? posFromLeft : 0)),
            top: Math.min(prevSelectionBox.top, pageY - (posFromTop ? posFromTop : 0)),
            right: Math.max(prevSelectionBox.right, pageX - (posFromLeft ? posFromLeft : 0)),
            bottom: Math.max(prevSelectionBox.bottom, pageY - (posFromTop ? posFromTop : 0)),
        } : null));
    }
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
    };

    const handleClearSelection = () => {
        setSelectionBox(null);
    };

    console.log(isSelecting);

    return (
        select ? <div onDoubleClick={e=>{if (onClick) onClick(e)}} style={style} className={`selection-container${className ? ` ${className}` : ""}`} onMouseDown={e=>handleMouseDown(e)} onMouseMove={e=>handleMouseMove(e)} onMouseUp={handleMouseUp}>
            {isSelecting ? <div className={`selection-box ${isSelecting ? 'active' : ''}`}
                 style={ isSelecting && selectionBox ?{
                   left: selectionBox.left,
                   top: selectionBox.top,
                   width: (selectionBox?.right || 0) - (selectionBox?.left || 0),
                   height: (selectionBox?.bottom || 0) - (selectionBox?.top || 0),
                 } : {}}></div> : <></>}
            <div>
                {children}
            </div>
        </div>
        :
        <div style={style} className={className} onClick={e=> {if (onClick) onClick(e)}}>{children}</div>
    )
}

export default SelectDiv;