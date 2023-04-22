import WindowHeader from "../../../../window-header/windowHeader.component";
import InputText from "../../../../input/inputText.component";
import InputNumber from "../../../../input/inputNumber.component";
import Button from "../../../../buttons/button.component";

type typeOfAddTicketParams = {
    closeFunction : Function
}

const AddTicket = ({closeFunction}:typeOfAddTicketParams)=>{
    return (
        <div>
            <WindowHeader title="Jegy hozzáadása" closeWindowFunction={closeFunction}/>
            <InputText title = "Jegy neve" onChangeFunction={()=>{}} />
            <InputNumber title = "Jegy alapára" onChangeFunction={()=>{}} />
            <InputNumber title="Maximum jegyár" onChangeFunction={()=>{}} />
            <InputNumber title = "Minimum jegyár" onChangeFunction={()=>{}} />
            <Button title = "Mentés" onClickFunction={()=>{}} />

        </div>
    )
}

export default AddTicket;