import typeOfSeatSectorExampleVisualization from "./type/exampleVisualisationParams";
import "../../css/seatSeactorExample.css";

const SeatSectorExampleVisualization = ({rotated, direction}:typeOfSeatSectorExampleVisualization)=>{

    return <div className = "example-sector" style={{transform : `rotate(${rotated}deg)`}}>
            <span className = "sector-direction-icon">{direction === "right" ? <i className="fas fa-arrow-right sector-direction-icon"></i> : <i className="fas fa-arrow-left sector-direction-icon"></i>}</span>
    </div>;
}


export default SeatSectorExampleVisualization;