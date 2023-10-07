import WindowHeader from "../../../../window-header/windowHeader.component"
import { useEffect,useState } from "react";
import postData from "../../../../connection/request";
import ParseLocalStorage from "../../../../../cookies/ParseLocalStorage";
import Loader from "../../../../loader/loader.component";
import "../../../../../css/addNewUserWindow.css";
import { v4 as uuid } from 'uuid';
import { Radio, Checkbox,Button, Empty } from 'antd';
import {FormControl, FormControlLabel, FormGroup, Grid, Paper, Typography, selectClasses } from '@mui/material';
import Window from "../../../../window/window.component";
type typeOfNewUserWindow = {
    closeFunction : Function,
    readyState : Function,
    accesses? : any,
    external? : boolean,
    userId? : string
    pending? : boolean,
    updateFunction? : Function,
    setError : Function
}
const NewUserWindow = ({closeFunction, readyState, accesses, external, userId, pending, updateFunction, setError}:typeOfNewUserWindow)=>{

    const [accessList, setAccesList]:[any, Function] = useState();
    const [checkedAccesses, setCheckedAccesses]:[any, Function] = useState(accesses ? accesses : []);
    const [externalSeller, setExternalSeller]:[boolean, Function] = useState(external ? external : false);
    const [loaded, setLoaded]:[boolean, Function] = useState(false);

    console.log(external, accesses);
    
    useEffect(()=>{
        setLoaded(false);
        postData("/get-all-access", {token : ParseLocalStorage("long_token")})
        .then((data:any)=>{
            if (!data.error){
                setAccesList(data);
                let e:any = {};
                for (let i = 0; i < Object.keys(data).length; i++){
                    e[Object.keys(data)[i]] = checkedAccesses[Object.keys(data)[i]] ? true : false;
                }
                setCheckedAccesses(e);
            }
            else{
                setError(data.message ? data.message : "Hiba történt az adatok betöltése közben.");
            }
            setLoaded(true);
        })
    }, []);

    const changeCheck = (checked:boolean, id:string)=>{
        let e = {...checkedAccesses};
        e[id] = checked;
        setCheckedAccesses(e);
    }

    const newUser = ()=>{
        postData( userId ? `/edit-${pending ? "pedding-user" : "user"}/${userId}` : "/add-new-user", {token : ParseLocalStorage("long_token"), access : checkedAccesses, externalSeller : externalSeller})
        .then((data)=>{
            if (!data.error && data.token){
                    readyState(data.token, data.url);
            }
            if (!data.error && userId){
                closeFunction();
                if (updateFunction) updateFunction();
            }
            if (data.error){
                setError(data.message ? data.message : "Hiba történt a felhasználó metése közben");
            }
        });
    }

    console.log(checkedAccesses);

    return (
        <Window title = "Felhasználó" closeFunction={closeFunction}>
            <ul className = "accesses">
                <FormGroup>
                <FormControl component="fieldset">
            {
                accessList && Object.keys(accessList).length ? 
                Object.keys(accessList).map((element)=>{
                    let id = uuid();
                return (<Checkbox key={id} checked={checkedAccesses[element]} onChange={e => changeCheck(e.target.checked, element)}>{accessList[element][0]}</Checkbox>)})
                : loaded ? <Empty /> : <Loader />
            }
            </FormControl>
            </FormGroup>
            </ul>
            <div className = "seller">
            <Radio.Group onChange={(e:any)=>{setExternalSeller(e.target.value)}} defaultValue={externalSeller} className = "event-settings-radio">
                <Radio.Button value={true}>Külső eladó</Radio.Button>
                <Radio.Button value={false}>Belső dolgozó</Radio.Button>
            </Radio.Group>
            </div>
            <div className = "new-user-button">
            <Button title = "Létrehozás" onClick={newUser}>Mentés</Button>
            </div>
        </Window>
    );
}

//return <li key = {element} ><label htmlFor={id}>{accessList[element][0]}</label><Checkbox params = {[element]} id = {id} className = "checkbox" title = "" onChangeFunction = {changeCheck} defaultChecked = {false}/></li>;

export default NewUserWindow;