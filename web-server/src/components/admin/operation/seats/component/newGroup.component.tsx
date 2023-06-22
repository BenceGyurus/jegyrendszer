import { useState } from "react";
import InputText from "../../../../input/inputText.component";
type newGroupType = {
    addNewFunction : Function
}
const NewGroup = ({addNewFunction}:newGroupType)=>{
    const [nameOfText, setNameOfText] = useState("");
    return (
        <div>
            <InputText title = "Csoport neve" onChangeFunction={setNameOfText}/>
            <input type="button" className = "button" value="Létrehozás" onClick={event => addNewFunction(nameOfText, 0,0)}/>
        </div>
    )
}

/*
<label htmlFor="nameOfGroup" className = "newGroupLabel">Csoprt neve</label>
<input type="text" className = "newGroupInput" id="nameOfGroup" onChange={event => setNameOfText(event.target.value)}/>
*/

export default NewGroup;