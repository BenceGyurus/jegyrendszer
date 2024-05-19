import TextEditor from "../../../text-editor/textEditor.component";
import { useState, useEffect } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import SaveButton from "../../../saveButton/saveButton.component";
import Notification from "../../../notification/notification.component";
import Error from "../../../notification/error.component";
import Success from "../../../notification/success.component";
const EditAszf = ()=>{


    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

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
        .then(async (response)=>{
            if (response.error) setError(response.message ? await response.message ? response.message : "Hiba törént a mentés közben" : "Hiba törént a mentés közben");
            else{
                setSuccess("A mentés sikeresen megtörtént");
            }
            
        })
    }

    useEffect(()=>{
        getAszf();
    },[]);

    const [value, setValue] = useState("");

    return (
    <div>
        <Notification element={<><Error open = {!!error} setOpen = {setError} title={error} />{success ? <Success closeFunction={()=>setSuccess("")} title = {success}/> : <></>}</>} />
    <h1>Általános szerződési feltételek szerkesztése</h1>
    <TextEditor value={value} onChangeFunction={setValue} />
    <SaveButton onClickFunction={saveAszf} />
    </div>
    );
}

export default EditAszf;