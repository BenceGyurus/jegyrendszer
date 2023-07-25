import TextEditor from "../../../text-editor/textEditor.component";
import { useState, useEffect } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import SaveButton from "../../../saveButton/saveButton.component";


const EditMail = ()=>{

    const [value, setValue] = useState("");

    useEffect(()=>{
        postData("/get-mail", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (!response.error){
                setValue(parseMail(response.mail));
            }
        })
    }, []);

    const save = ()=>{
        postData("/edit-mail", {token : ParseLocalStorage("long_token"), datas : {mail : codeMail(value)}})
        .then(response=>{
            if (!response.error){
                setValue(response.mail);
            }
        })
    }

    const codeMail = (text:string)=>{
        return text.replaceAll("=", "!equal!");
    }

    const parseMail = (text:string)=>{
        return text.replaceAll("!equal!", "=");
    }

    return (
        <div>
            <TextEditor value={value} onChangeFunction={setValue} />
            <SaveButton onClickFunction={save} />
        </div>
    )
}

export default EditMail;