import TextEditor from "../../../text-editor/textEditor.component";
import { useState, useEffect } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import SaveButton from "../../../saveButton/saveButton.component";
const EditAszf = ()=>{

    const getAszf = ()=>{
        postData("/get-aszf", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (!response.error){
                setValue(parseAszf(response.aszf));
            }
        })
    }

    const codeAszf = (text:string)=>{
        return text.replaceAll("=", "!equal!");
    }

    const parseAszf = (text:string)=>{
        return text.replaceAll("!equal!", "=");
    }

    const saveAszf = ()=>{
        postData("/edit-aszf", {token : ParseLocalStorage("long_token"), datas : {aszf : codeAszf(value)}})
    }

    useEffect(()=>{
        getAszf();
    },[]);

    const [value, setValue] = useState("");

    return (
    <div>
    <h1>Általános szerződési feltételek szerkesztése</h1>
    <TextEditor value={value} onChangeFunction={setValue} />
    <SaveButton onClickFunction={saveAszf} />
    </div>
    );
}

export default EditAszf;