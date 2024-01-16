import { ClassNames } from "@emotion/react";
import typeOfStage from "./type/stageType";

const Stage = ({name, id, width, height, borderRadius, color, title, x, y, isSelected}:typeOfStage)=>{

    const stageClasses = `editing-stage ${isSelected ? "selected shake" : ""}`;
    const stageStyles:React.CSSProperties = {
        position: "absolute",
        top: y,
        left: x,
        width: width,
        height: height,
        background: color
    };

    return <span className = {stageClasses} style={stageStyles}></span>
}

export default Stage;