import WindowHeader from "../../../../window-header/windowHeader.component";
import "../../../../../css/showNewUserToken.css";
import Window from "../../../../window/window.component";
import { Button, Input } from "antd";
type typeOfShowTokenParams = {
    token : string,
    url : string,
    closeFunction : Function
};
const ShowToken = ( { token, url, closeFunction }:typeOfShowTokenParams )=>{

    const copy =()=>{
        var copyText:any = document.getElementById("token");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
    }

    return (
        <Window title = "Regisztrációs link" closeFunction={closeFunction}>
            <div className = "reg-window-mid">
                <h3>Regisztrációs link</h3>
                <Input id = "token" className = "inputOfToken" type="text" value = {`${window.location.origin}${url}${token}`} />
                <Button className = "copy-button" onClick = {copy} >Másolás</Button>
            </div>
        </Window>
    )
}

export default ShowToken;