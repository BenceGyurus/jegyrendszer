import { useState } from "react";
type newGroupType = {
    addNewFunction : Function
}
const NewGroup = ({addNewFunction}:newGroupType)=>{
    const [nameOfText, setNameOfText] = useState("");
    return (
        <div>
            <label htmlFor="nameOfGroup" className = "newGroupLabel">Csoprt neve</label>
            <input type="text" className = "newGroupInput" id="nameOfGroup" onChange={event => setNameOfText(event.target.value)}/>
            <input type="button" className = "button" value="Létrehozás" onClick={event => addNewFunction(nameOfText, 0,0)}/>
        </div>
    )
}

export default NewGroup;