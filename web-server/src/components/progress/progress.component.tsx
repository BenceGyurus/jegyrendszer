import "../../css/progressbar.css";
import { useState } from "react";

type typeOfBar = {
    amount : number,
    backgroundColor : string,
    id : string,
    name? : string
}

type typeOfProgressBarParams = {
    full : number,
    listOfBars : Array<typeOfBar>,
    width? : number
}

const ProgressBar = ({full, listOfBars, width}:typeOfProgressBarParams)=>{

    const [widthOfProgressBar, setWidthOfProgressBar] = useState(width ? width : 200);

    return (
        <div className = "progress-bar-div">
            <div className = "progress-bar" style={{width : widthOfProgressBar, height : 50}}>
                {
                    listOfBars.map((bar)=>{
                        return (<div key = {bar.id} className = "progress-bar-fill" style = {{width : (bar.amount/full)*widthOfProgressBar, backgroundColor:bar.backgroundColor}}></div>)
                    })
                }
            </div>
            <div>
                {
                    listOfBars.map((bar)=>{
                        return (
                            <div className = "label-of-bar"><span className = "bar-name-span">{bar.name}</span><span className = "bar-color" style = {{background:bar.backgroundColor}}></span></div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ProgressBar;