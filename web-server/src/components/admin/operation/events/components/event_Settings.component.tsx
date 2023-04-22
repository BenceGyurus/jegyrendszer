import { useState, useEffect } from "react";
import InputText from "../../../../input/inputText.component";
import InputNumber from "../../../../input/inputNumber.component";
import TextArea from "../../../../input/textArea.component";
import "../../../../../css/eventSettings.css";
import AddNewButton from "../../../../buttons/add_New.component";
import SaveButton from "../../../../saveButton/saveButton.component";
import AddTicket from "./addTicket.component";
import Select from "../../../../input/select.component";
import postData from "../../../../connection/request";
import ParseCookies from "../../../../../cookies/parseCookies";
const EventSettings = ()=>{

    const [nameOfEvent, setNameOfEvent]:[string, Function] = useState("");
    const [desciption, setDescription]:[string, Function] = useState("");
    const [addWindow, setAddWindow]:[boolean, Function] = useState(false);
    const [tickets, setTickets]:[Array<any>, Function] = useState([]);
    const [selectedVenue, setSelectedVenue]:[string, Function] = useState("");
    const [venues, setVenues]:[Array<{value : string, title : string}>, Function] = useState([]);

    console.log(nameOfEvent, desciption, selectedVenue);

    useEffect(()=>{
        postData("/get-venues-in-array", {token : ParseCookies("long_token")}).
        then((datas)=>{
            if (datas.datas){
                setVenues(datas.datas);
            }
            else{
                
            }
        });
    }, []);

    return (
        <div className = "create-Event-Settings-Main">
            <InputText title="Rendezvény címe" onChangeFunction={setNameOfEvent} value = {nameOfEvent} />
            <TextArea onChangeFunction={setDescription} title = "Rendezvény leírása" />
            <AddNewButton onClick={()=>{setAddWindow(true)}} />
            <Select options = {venues} onChangeFunction = {setSelectedVenue} />
            {addWindow ? <AddTicket closeFunction={()=>{setAddWindow(false)}} /> : ""}
            <SaveButton onClickFunction={()=>{}} />
        </div>
    );
}

export default EventSettings;