import { useEffect, useRef, useState } from "react";
import drawSeat from "../seat-visualization-engine/drawSeat";
import "../../css/seatLegend.css";

const Legend = ()=>{
    
    const freeCanvasRef:any = useRef(null);
    const occupiedCanvasRef:any = useRef(null);
    const pendingCanvasRef:any = useRef(null);
    const [seatSize, setSeatSize]:[number, Function] = useState(20);

    useEffect(()=>{

    const canvases = [freeCanvasRef.current, occupiedCanvasRef.current, pendingCanvasRef.current];

    /*const freeCanvas = ;
    */

    let contextes:Array<unknown> = [];

    canvases.forEach((canvas)=>{
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        contextes.push(context);
    })

    // Loop through the seats and draw them

    drawSeat(0, 0, true, false, false, true, contextes[0], 50,50, "black");
    drawSeat(0, 0, false, false, true, false, contextes[1], 50,50, "black");
    drawSeat(0, 0, false, false, false, false, contextes[2], 50,50, "black");
    
    }); 
   
    return (
        <div className = "seat-legend-conteiner">
            <div className = "legend">
            <canvas ref={freeCanvasRef} width={seatSize} height={seatSize} className = "legend-canvas" />
            <p className = "legend-label">Szabad hely</p>
            </div>
            <div className = "legend">
            <canvas className = "legend-canvas" ref={occupiedCanvasRef} width={seatSize} height={seatSize} />
            <p className = "legend-label">Vásárlás allat lévő hely</p>
            </div>
            <div className = "legend">
            <canvas ref={pendingCanvasRef} width={seatSize} height={seatSize} className = "legend-canvas" />
            <p className = "legend-label">Foglalt hely</p>
            </div>
        </div>
    );
}

export default Legend;