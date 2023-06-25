import InputText from "../input/inputText.component"
import InputNumber from "../input/inputNumber.component"
import { useState } from "react"
import "../../css/datasOfCustomers.css";

const DatasOfCustomer = ()=>{

    const [name, setName] = useState("");
    const [postCode, setPostCode] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [taxNumber, setTaxNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");

    return <div className = "datas-of-customer">
        <h2>Számlázási adatok:</h2>
        <label htmlFor="fullname">Teljes név</label>
        <input type="text" id = "fullname" onChange={e=>{setName(e.target.value)}} autoComplete="name" />
        <div className = "customer-data-component">
            <h3>Számlázási cím</h3>
            <div className = "post-code-and-city">
                <div id = "postal-code-div">
                <label htmlFor="postCode">Irányítószám</label>
                <input type="text" id = "postCode" onChange={e=>{setPostCode(e.target.value)}} autoComplete="postal-code" />
                </div>
                <div id = "city-div">
                <label htmlFor="city">Város</label>
                <input type="text" id = "city" onChange={e=>{setCity(e.target.value)}} autoComplete="country-name"/>
                </div>
            </div>
            <label htmlFor="address">Cím</label>
            <input type="text" id = "address" onChange={e=>{setAddress(e.target.value)}} autoComplete="street-address" />
            <label htmlFor="address2">Emelet, lépcsőház stb. (nem kötelező)</label>
            <input type="text" id = "address2" onChange={e=>{setAddress2(e.target.value)}}/>
        </div>
        <label htmlFor="tax-number">Adószám (magánszemélynek nem kötelező)</label>
        <input type="text" id = "tax-number" onChange={e=>{setName(e.target.value)}}/>
        <div className = "contact customer-data-component">
            <h3>Kapcsolattartás</h3>
            <label htmlFor="email">E-mail cím</label>
            <input type="email" id = "email" onChange={e=>{setName(e.target.value)}} autoComplete="email" />
            <label htmlFor="phone">Telefonszám</label>
            <input type="phone" id = "phone" onChange={e=>{setName(e.target.value)}} autoComplete="tel" />
        </div>
        <input type="checkbox" id = "accept" />
        <label htmlFor="accept">Elfogadom az <a>Általános szerződési feltételeket</a></label>
    </div>
}

export default DatasOfCustomer;