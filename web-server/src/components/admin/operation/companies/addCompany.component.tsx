import InputText from "../../../input/inputText.component";
import WindowHeader from "../../../window-header/windowHeader.component";
import "../../../../css/newCompany.css";
import Button from "../../../buttons/button.component";
import { useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import Window from "../../../window/window.component";

type typeOfAddCompanyParams = {
    closeWindowFunction : Function,
    errorFunction : Function,
    updateFunction : Function,
    nameOfCompany : string,
    tax : string,
    id : string
    website : string
}

const AddCompany = ({ closeWindowFunction, errorFunction, updateFunction, nameOfCompany, tax, id, website}:typeOfAddCompanyParams)=>{

    const [name, setName] = useState(nameOfCompany ? nameOfCompany : "");
    const [taxNumber, setTaxNumber] = useState(tax ? tax : "");
    const [webSite, setWebSite] = useState(website ? website : "");

    const save = ()=>{
        if (name && taxNumber){
            postData(id ? `/edit-company/${id}` : "/new-company", {token : ParseLocalStorage("long_token"), datas : {name : name, taxNumber : taxNumber, website : webSite}})
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
        <Window closeFunction={closeWindowFunction} title = "Vállalatok hozzáadása">
            <InputText value={name} onChangeFunction={setName} title = "Vállalat neve" />
            <InputText value={taxNumber} onChangeFunction={setTaxNumber} title = "Vállalat adószáma" />
            <InputText value ={webSite} onChangeFunction={setWebSite} title = "Weboldal (pl.: http://agorasavaria.hu)" />
            <Button title = "Mentés" onClickFunction={save} />
        </Window>
    )
};

export default AddCompany;