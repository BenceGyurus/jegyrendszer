import { Button } from "antd"
import FileUpload from "../../../file-upload/fileUpload.component"
import InputText from "../../../input/inputText.component"
import Window from "../../../window/window.component"
import { useState } from "react"
import postData from "../../../connection/request"
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage"

type typeOfAdsWindow = {
    closeFunction : Function,
    setError : Function,
    updateFunction : Function,
    nameE? : string,
    fileE? : string,
    websiteE? : string,
    _id? : string
}

const AdsWindow = ( { closeFunction, setError, updateFunction, nameE, fileE, websiteE, _id }:typeOfAdsWindow )=>{

    const [nameOfAd, setNameOfAd] = useState(nameE ? nameE : "");
    const [file, setFile] = useState(fileE ? fileE : "");
    const [website, setWebsite] = useState(websiteE ? websiteE : "");

    const save = ()=>{
        if (nameOfAd && file){
            postData(_id ? `/edit-ads/${_id}`: "/create-ads", { token : ParseLocalStorage("long_token"), datas : {
                name : nameOfAd,
                src : file,
                type : file.split(".")[file.split(".").length-1],
                website : website
            } })
            .then(response=>{
                if (response.error){
                    setError(response.message ? response.message : "Hiba történt a mentés során");
                }
                else{
                    closeFunction();
                }
                updateFunction();
            })
        }
    }
    console.log(file);

    return (<Window closeFunction={closeFunction} title="Új hírdetés létrehozása">
            <InputText onChangeFunction={setNameOfAd} value={nameOfAd} title = "Hírdetés neve" info={{text : "Ez nem fog megjelenni a hirdetésben. Később ezzel tudják a felhaszálók azonosítani a hirdetésts."}} />
            <FileUpload fileName={file} onChangeFunction={setFile} />
            <InputText title="Weboldal" value={website} onChangeFunction={setWebsite} website = {true} info={{text : "A hirdetéshez weboldal csatolása lehetséges, ez qr-ban fog megjelenni."}} />
            <Button onClick={e=>save()}>Mentés</Button>
        </Window> )
}

export default AdsWindow;