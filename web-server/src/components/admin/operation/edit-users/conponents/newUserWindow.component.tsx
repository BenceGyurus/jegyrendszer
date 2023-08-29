import WindowHeader from "../../../../window-header/windowHeader.component"
import { useEffect,useState } from "react";
import postData from "../../../../connection/request";
import ParseLocalStorage from "../../../../../cookies/ParseLocalStorage";
import Loader from "../../../../loader/loader.component";
import "../../../../../css/addNewUserWindow.css";
import { v4 as uuid } from 'uuid';
import Button from "../../../../buttons/button.component";
import {Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Paper, Typography } from '@mui/material';
type typeOfNewUserWindow = {
    closeFunction : Function,
    readyState : Function
}
const NewUserWindow = ({closeFunction, readyState}:typeOfNewUserWindow)=>{
    const [accessList, setAccesList]:any = useState();
    const [checkedAccesses, setCheckedAccesses]:any = useState();
    const [externalSeller, setExternalSeller]:[boolean, Function] = useState(false);
    useEffect(()=>{
        postData("/get-all-access", {token : ParseLocalStorage("long_token")})
        .then((data:any)=>{
            if (!data.error){
                setAccesList(data);
                let e:any = {};
                for (let i = 0; i < Object.keys(data).length; i++){
                    e[Object.keys(data)[i]] = false;
                }
                setCheckedAccesses(e);
            }
        })
    }, []);

    const changeCheck = (checked:boolean, id:string)=>{
        let e = {...checkedAccesses};
        e[id] = checked;
        setCheckedAccesses(e);
    }

    const newUser = ()=>{
        postData("/add-new-user", {token : ParseLocalStorage("long_token"), access : checkedAccesses, externalSeller : externalSeller})
        .then((data)=>{
            if (!data.error && data.token){
                readyState(data.token, data.url);
            }
        });
    }

    return (
        <div className = "new-user-window">
            <WindowHeader title = "Új felhasználó hozzáadása" closeWindowFunction={()=>{closeFunction()}} />
            <ul className = "accesses">
                <FormGroup>
                <FormControl component="fieldset">
            {
                accessList && Object.keys(accessList).length ? 
                Object.keys(accessList).map((element)=>{
                    let id = uuid();
                return (<FormControlLabel
                  key={element}
                  control={<Checkbox onChange={e => changeCheck(e.target.checked, element)} />}
                  label={accessList[element][0]}
                />)
                })
                    
                
                : <Loader />
            }
            </FormControl>
            </FormGroup>
            </ul>
            <div className = "seller">
                <Checkbox title = "Külső eladó" onChange={e=>setExternalSeller(e.target.checked)} defaultChecked = {externalSeller} />
            </div>
            <div className = "new-user-button">
            <Button title = "Létrehozás" onClickFunction={newUser}/>
            </div>
        </div>
    );
}

//return <li key = {element} ><label htmlFor={id}>{accessList[element][0]}</label><Checkbox params = {[element]} id = {id} className = "checkbox" title = "" onChangeFunction = {changeCheck} defaultChecked = {false}/></li>;

export default NewUserWindow;