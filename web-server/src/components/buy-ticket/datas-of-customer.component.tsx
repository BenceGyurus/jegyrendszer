import InputText from "../input/inputText.component"
import InputNumber from "../input/inputNumber.component"
import { useState } from "react"

const DatasOfCustomer = ()=>{

    const [name, setName] = useState("");
    const [postCode, setPostCode] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");

    return <div className = "datas-of-customer">
        <h2>Számlázási adatok:</h2>
        <InputText title = "Teljes név" onChangeFunction={setName} />
        <h3>Számlázási cím</h3>
        <InputText title = "Írányítószám" onChangeFunction={setPostCode} />
        <InputText title = "Város" onChangeFunction={setCity} />
        <InputText title="Utca, házszám" onChangeFunction={setAddress} />
        <InputText title = "Lépcsőház, emelt" onChangeFunction={setAddress2} /> 
        <InputText title = "Adószám (Magánszemélyként nem kötelező)" onChangeFunction={()=>{}} />
        <h3>Kapcsolattartás</h3>
        <InputText title = "E-mail cím" onChangeFunction={()=>{}} />
        <InputText title = "Telefonszám" onChangeFunction={()=>{}} />
    </div>
}

export default DatasOfCustomer;