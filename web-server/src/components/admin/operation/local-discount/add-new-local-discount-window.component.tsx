import InputNumber from "../../../input/inputNumber.component";
import InputText from "../../../input/inputText.component";
import WindowHeader from "../../../window-header/windowHeader.component";
import { useState } from "react";
import Button from "../../../buttons/button.component";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";

type typeOfAddNewLocalDiscountWindowParams = {
    closeWindowFunction : Function,
    nameOfDiscount? : string,
    amountOfDiscount? : number,
    money? : boolean,
    _id? : string,
    updateFunction : Function
}

const AddNewLocalDiscountWindow = ({closeWindowFunction, nameOfDiscount, amountOfDiscount,money, _id, updateFunction}:typeOfAddNewLocalDiscountWindowParams)=>{

    const [name, setName] = useState(nameOfDiscount ? nameOfDiscount : "");
    const [amount, setAmount] = useState(amountOfDiscount ? amountOfDiscount : 0);
    const [typeOfDiscount, setTypeOfDiscount] = useState(money ? money : false);

    const save = ()=>{
        postData(`/save-local-discount${_id ? `/${_id}` : ""}`, {token : ParseLocalStorage("long_token"), datas : {name : name, amount : amount, type : typeOfDiscount}})
        .then(
            (response:any)=>{
                closeWindowFunction();
                updateFunction();
            }
        )

    }

    return <div className = "new-coupon-window">
        <WindowHeader title = "Új kedvezmény létrehozása" closeWindowFunction={closeWindowFunction} />
        <InputText value={name} onChangeFunction={setName} title="Kedvezmény neve" />
        <div className = "discountType">
            <span className = {`typeOfDiscount procent${!typeOfDiscount ? " selected-type" : ""}`} onClick={e=>setTypeOfDiscount(false)}>%</span>
            <span className = {`typeOfDiscount cash${typeOfDiscount ? " selected-type" : ""}`} onClick={e=>setTypeOfDiscount(true)}>Ft</span>
        </div>
        <InputNumber value={amount} onChangeFunction={setAmount} title = "Kedvezmény mértéke" />
        <Button title="Mentés" onClickFunction={save} />
    </div>
}

export default AddNewLocalDiscountWindow;