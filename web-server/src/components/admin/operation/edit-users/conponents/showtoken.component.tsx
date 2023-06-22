import WindowHeader from "../../../../window-header/windowHeader.component";
import "../../../../../css/showNewUserToken.css";
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
        <div className = "showNewUserToken">
            <WindowHeader title="Felhasználó" closeWindowFunction={closeFunction} />
            <div>
                <h3>Regisztrációs link</h3>
                <input id = "token" className = "inputOfToken" type="text" value = {`${window.location.origin}${url}${token}`} />
                <input className = "copy-button" type="button" value="Másolás" onClick = {copy}/>
            </div>
        </div>
    )
}

export default ShowToken;