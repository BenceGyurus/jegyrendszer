import InputText from "../../../input/inputText.component";
import WindowHeader from "../../../window-header/windowHeader.component";
import "../../../../css/newCompany.css";
import Button from "../../../buttons/button.component";
import { useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";

type typeOfAddCompanyParams = {
    closeWindowFunction : Function,
    errorFunction : Function,
    updateFunction : Function,
    nameOfCompany : string,
    tax : string,
    id : string
}

const AddCompany = ({ closeWindowFunction, errorFunction, updateFunction, nameOfCompany, tax, id}:typeOfAddCompanyParams)=>{

    const [name, setName] = useState(nameOfCompany ? nameOfCompany : "");
    const [taxNumber, setTaxNumber] = useState(tax ? tax : "");

    const save = ()=>{
        if (name && taxNumber){
            postData(id ? `/edit-company/${id}` : "/new-company", {token : ParseLocalStorage("long_token"), datas : {name : name, taxNumber : taxNumber}})
                .then(async (response)=>{
                    if (response.responseData){
                        //errorFunction((await response.responseData).message)
                    }
                    else if (!response.error){
                        closeWindowFunction();
                        updateFunction();
                    }
            })
        }
        else{
            errorFunction("Kérlek töltsd ki az összes mezőt");
        }
    }

    return (
    <div className = "add-company-window">
        <WindowHeader closeWindowFunction={closeWindowFunction} title = "Vállalatok hozzáadása" />
        <div className = "add-company-window-data">
            <InputText value={name} onChangeFunction={setName} title = "Vállalat neve" />
            <InputText value={taxNumber} onChangeFunction={setTaxNumber} title = "Vállalat adószáma" />
            <Button title = "Mentés" onClickFunction={save} />
        </div>
    </div>
    )
};

export default AddCompany;