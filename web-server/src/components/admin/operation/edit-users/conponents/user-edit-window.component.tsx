import { useState, useEffect } from "react";
import postData from "../../../../connection/request";
import ParseLocalStorage from "../../../../../cookies/ParseLocalStorage";
import "../../../../../css/edit-user-window.css";
import WindowHeader from "../../../../window-header/windowHeader.component";
import Loader from "../../../../loader/loader.component";
import AccessList from "./accesslist.component";
import SaveButton from "../../../../saveButton/saveButton.component";

type typeOfUser = {
    username : string,
    access : any,
    cantEdit : Boolean,
    id : string,
    pedding? : boolean
}


type typeOfUserEditWindowParams = {
    user : typeOfUser,
    closeFunction : Function,
    errorFunction : Function,
    updateFunction : Function,
    succFunction : Function,
}


const UserEditWindow = ({user, closeFunction, errorFunction, updateFunction, succFunction}:typeOfUserEditWindowParams)=>{

    const [accesses, setAccesses]:any = useState();
    const [got, setGot]:[boolean, Function] = useState(false);
    const [userAccesses, setUserAcceses]:[Array<any>, Function] = useState([]);


    const saveChanges = ()=>{
        if (userAccesses){
            let sendData:any = {};
            userAccesses.forEach((i:any)=>{
                sendData[i[0]] = i[2];
            })
            postData(`/edit-${user.pedding ? "pedding-user" : "user"}/${user.id}`, {token : ParseLocalStorage("long_token"), datas : sendData})
            .then(response=>{
                if (!response.error){
                    succFunction("Sikeres mentés")
                }
                else{
                    errorFunction(response.message ? response.message : "Váratlan hiba történt a mentés során");
                }
                updateFunction();
                closeFunction();
            });
        }
    }

    useEffect(()=>{
        postData("/get-all-access", {token : ParseLocalStorage("long_token")})
        .then(response => {
            setGot(true);
            if (response.error){
                response.message ? errorFunction(response.message) : errorFunction("Váratlan hiba történt");
            }
            else if (response && typeof response == "object"){
                let l:Array<unknown> = [];
                Object.keys(response).forEach((access:any)=>{
                    l.push([access, response[access][0], !(!user.access[access])])
                })
                console.log(l);
                setUserAcceses(l);
            }
        })
    }, []);

    const changeFunction = (status:boolean, access:string)=>{
        console.log(status, access);
        let l = [...userAccesses];
        for (let i = 0; i < l.length; i++){
            if (l[i][0] == access){
                l[i][2] = status;
            }
        }
        setUserAcceses(l);
    }

    console.log(userAccesses);

    return (
        <div className = "user-edit-window-main-div">
            <WindowHeader title={`${user.username} felhasználó szerkesztése`} closeWindowFunction={closeFunction} />
            {userAccesses.length || got ? <AccessList changeFunction={changeFunction} userAccess={userAccesses}/> : <Loader /> }
            <SaveButton onClickFunction={saveChanges} />
        </div>
    )
}

//

export default UserEditWindow;