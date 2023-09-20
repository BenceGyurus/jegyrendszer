import { Button } from "@mui/material";
import InputText from "../input/inputText.component";
import Window from "../window/window.component";

type typeOfSelecNameParams = {
    name : string,
    setName : Function,
    connectFunction : Function
}

const SelectName = ( { name, setName, connectFunction }:typeOfSelecNameParams )=>{
    return (<Window closeFunction={()=>{}} title="Kód megadása" >
        <InputText value = {name} onChangeFunction={setName} title = "Kiszolgáló azonosíó" info={{text : "Adja meg az admin felületen generált azonosítót."}} />
        <Button onClick = {e=>connectFunction()}>Tovább</Button>
    </Window>);
};

export default SelectName;