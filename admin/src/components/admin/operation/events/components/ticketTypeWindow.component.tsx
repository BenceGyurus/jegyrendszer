import { Button, Input, Radio } from "antd"
import TypeOfTicketTypeParams from "../typeOfticketTypeParams"
import Window from "../../../../window/window.component"
import InputText from "../../../../input/inputText.component"
import { useState } from "react"
import { v4 as uuid } from 'uuid';
import InputNumber from "../../../../input/inputNumber.component"

const isPublicOptions = [
    { label: 'Publikus', value: true },
    { label: 'Privát', value: false },
  ];

const TicketTypeWindow = ({type, closeFunction, saveFunction}:TypeOfTicketTypeParams)=>{

    console.log("new type window");

    const [name, setName] = useState<string>(type ? type.name : "");
    const [price, setPrice] = useState<number>(type ? type.price : 0);
    const [isPublic, setIsPublic] = useState(type != null ? type.isPublic : true);

    return (
        <Window closeFunction={closeFunction} title="Jegy típus hozzásadás">
            <InputText value={name} title="Jegy típus neve" onChangeFunction={setName}  />
            <InputNumber sufix="Ft" title="Jegy ára" value={price} onChangeFunction={setPrice} />
            <Radio.Group 
                options={isPublicOptions}
                onChange={e=>setIsPublic(e.target.value)}
                value={isPublic}
                optionType="button"
                className = "is-public-radio-button"
            />
            <Button onClick={()=>saveFunction({name : name, price : price, isPublic : isPublic, id : type?.id ? type.id : uuid()})}>Mentés</Button>
        </Window>
    )
}

export default TicketTypeWindow