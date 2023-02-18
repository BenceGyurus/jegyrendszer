import { useState } from "react";
type newGroupType = {
    addNewFunction : any
}
const NewGroup = ({addNewFunction}:newGroupType)=>{
    const [nameOfText, setNameOfText] = useState("");
    return (
        <div>
            <label htmlFor="nameOfGroup">Csoprt neve</label>
            <input type="text" id="nameOfGroup" onChange={event => setNameOfText(event.target.value)}/>
            <input type="button" value="Létrehozás" onClick={event => addNewFunction(nameOfText, 0,0)}/>
        </div>
    )
}

export default NewGroup;