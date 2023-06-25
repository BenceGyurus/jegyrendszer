import postData from "../../../connection/request";
import ParseCookies from "../../../../cookies/parseCookies";
import { useState, useEffect } from "react";
import EventList from "./ref-events-list.component";
import Select from "../../../input/select.component";
import InputText from "../../../input/inputText.component";
import "../../../../css/new-ref-code.css";
import InputNumber from "../../../input/inputNumber.component";
import Calendar from "../../../calendar/calendar.component";
import Button from "../../../buttons/button.component";
import WindowHeader from "../../../window-header/windowHeader.component";

type typeOfEvents = {
    name : string,
    id : string,
    eventDate : string,
    selected : boolean
}

type typeOfAddNewRefCodeParams = {
    closeFunction : Function,
    gotEvents? : Array<string>,
    name? : string,
    tofDiscound? : boolean,
    amount? : number,
    valid? : string,
    tOfCoupon? : number,
    refresh : Function,
    gotId? : string
}

const AddNewRefCode = ({closeFunction, gotEvents, name, tofDiscound, amount, valid, tOfCoupon, refresh, gotId}:typeOfAddNewRefCodeParams)=>{

    const [events,setEvents] = useState(Array<typeOfEvents>);
    const [refName, setRefName] = useState(name ? name : "");
    const [typeOfDiscount, setTypeOfDiscount] = useState(tofDiscound ? tofDiscound : false);
    const [amountOfDiscount, setAmountOfDiscount] = useState(amount ? amount : 0);
    const [validity, setValidity] = useState(valid ? valid : "");
    const [typeOfCoupon, setTypeOfCoupon] = useState(tOfCoupon ? String(tOfCoupon) : "0");
    const [eventId, setId] = useState(gotId ? gotId : false);

    console.log(validity);

    const setNameOfCoupon = (name:string)=>{
        setRefName(name.toUpperCase());
    }

    const selectEvents = (id:string)=>{
        let l = [...events];
        for (let i = 0; i < l.length; i++){
            if (l[i].id === id){
                l[i].selected = !l[i].selected;
            }
        }
        setEvents(l);
    }

    const selectAllEvents = ()=>{
        let l = [...events];
        for (let i = 0; i < l.length; i++){
            l[i].selected = true;
        }
        setEvents(l);
    }

    useEffect(()=>{
        postData("/get-all-event", {token : ParseCookies("long_token")})
        .then(response=>{
            if (response.events){
                console.log(gotEvents);
                let pushEvents = [];
                for (let i = 0; i < response.events.length; i++){
                    pushEvents.push({...response.events[i], selected : gotEvents ? gotEvents.includes(response.events[i].id) ? true : false : false});
                }
                setEvents(pushEvents);
            }
        })
    }, []);

    const changeAmountOfDiscount = (amount:number)=>{
        if (!typeOfDiscount && amount >= 0 && amount <= 100){
            setAmountOfDiscount(amount)
        }
        else if (typeOfDiscount && amount >= 0){
            setAmountOfDiscount(amount);
        }
    }

    const saveFunction = ()=>{
        let useEvents = [];
        for (let i = 0; i < events.length; i++){
            if (events[i].selected){
                useEvents.push(events[i].id);
            }
        }
        let sendData = {
            name : refName,
            money : typeOfDiscount,
            validity : validity,
            amount : amountOfDiscount,
            type : Number(typeOfCoupon),
            events : useEvents
        }
        if (eventId){
            postData(`/edit-coupon/${eventId}`, {token: ParseCookies("long_token"), datas : sendData})
            .then(response=> {if (response.error){} ;refresh()});
        }
        else{
            postData("/new-coupon", {token: ParseCookies("long_token"), datas : sendData})
            .then(response=> {console.log(response); refresh()});
        }
    }

    return (<div className = "new-coupon-window">
        <WindowHeader closeWindowFunction={closeFunction} title = "Új kupon létrehozása"  className = "new-ref-code-window-header"/>
        <h3>Új létrehozása</h3>
        <InputText title="Kuponkód" onChangeFunction={setNameOfCoupon} value = {refName} />
        <h3>Események kiválasztása</h3>
        {events.length ? <EventList events={events} onClick = {selectEvents} selectAllFunction = {selectAllEvents} /> : ""}
        <Select value = {typeOfCoupon} onChangeFunction={setTypeOfCoupon} options = {[{title : "Korlátlanul felhasználható", value : "0"}, {title : "Egy eseményhez egyszer használható", value : "1"}, {title : "Csak egyszer használható", value : "2"}]} title = "Felhasználás" />
        <div className = "discountType">
            <span className = {`typeOfDiscount procent${!typeOfDiscount ? " selected-type" : ""}`} onClick={e=>setTypeOfDiscount(false)}>%</span>
            <span className = {`typeOfDiscount cash${typeOfDiscount ? " selected-type" : ""}`} onClick={e=>setTypeOfDiscount(true)}>Ft</span>
        </div>
        <InputNumber title = "Kedvezmény mértéke" onChangeFunction={changeAmountOfDiscount} value={amountOfDiscount} />
        <Calendar title = "Érvényességi ideje" onChangeFunction={setValidity} value = {validity} />
        <Button onClickFunction={saveFunction} title = "Létrehozás" />
    </div>);
}

export default AddNewRefCode;