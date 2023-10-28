import { useState, useRef, useEffect } from "react";
import typeOfZoomParams from "./type/zoomParams";
import "../../css/zoom.css";

const Zoom = ({ children, width, height, isZoom, gotScale, handleScale, setPos, defaultPos }:typeOfZoomParams)=>{
    const [zoom, setZoom] = useState(gotScale ? gotScale : 1);
    const [position, setPosition] = useState(defaultPos ? defaultPos : {x : 0, y : 0});
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
    const handleZoomIn = () => {
      setZoom(zoom + 0.1);
    };
  
    const handleZoomOut = () => {
      if (zoom > 0.1) {
        setZoom(zoom - 0.1);
        if (handleScale) handleScale(zoom - 0.1);
      }
    };
  
    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartPosition({ x: e.clientX, y: e.clientY });
      if (setPos )setPos({ x: e.clientX, y: e.clientY });
    };
  
    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPosition.x;
        const dy = e.clientY - startPosition.y;
        setPosition({
          x: position.x + dx / zoom,
          y: position.y + dy / zoom,
        });
        setStartPosition({ x: e.clientX, y: e.clientY });
        if (setPos )setPos({ x: e.clientX, y: e.clientY });
      }
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
    const handleMouseWheel = (e: React.WheelEvent) => {
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    };
  

  return (
    isZoom ? <div
      className="zoom-viewport"
      onWheel={handleMouseWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <div
        className="seating-arrangement"
      >
        <div
        style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          }}
        >
        {children}
        </div>
      </div>
    </div> : 
    children
  );
}

export default Zoom;