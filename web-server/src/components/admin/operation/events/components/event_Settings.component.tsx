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
import ImageUpload from "../../../../image-upload/imageUpload.component";
import { v4 as uuid } from 'uuid';
import TicketList from "./ticketList.component";
import Calendar from "../../../../calendar/calendar.component";

type typeOfGroups = {
    id : string,
    name : string,
    opened : boolean,
    posX : number,
    posY : number,
    status : boolean
};

type typeOfPlace = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string
}

type typeOfVenues = {
    background : {isImage : boolean, name : string},
    colorOfBackGround : string,
    colorOfSeat : string,
    groups : Array<typeOfGroups>,
    id : string,
    name : string,
    places : number,
    seatDatas : Array<typeOfPlace>,
    seatMode : boolean,
    selecttedGroup : string,
    sizeOfArea : {width : number, height : number},
    sizeOfSeat : number,
    suggestedGroups : Array<string>,

}

type typeOfTicket = {
    id : string,
    seats : Array<string>,
    price : number,
    min_Price : number,
    max_Price : number,
    name : string
}

const EventSettings = ()=>{

    const [nameOfEvent, setNameOfEvent]:[string, Function] = useState("");
    const [desciption, setDescription]:[string, Function] = useState("");
    const [addWindow, setAddWindow]:[boolean, Function] = useState(false);
    const [tickets, setTickets]:[Array<any>, Function] = useState(Array<typeOfTicket>);
    const [selectedVenue, setSelectedVenue]:[string, Function] = useState("");
    const [venues, setVenues]:[Array<{value : string, title : string}>, Function] = useState([]);
    const [backgroundImage, setBackgroundImage]:[string, Function] = useState(""); 
    const [venueDatas, setVenueDatas]:any = useState();
    const [all_Selected, setAll_Selected]:[Array<string>, Function] = useState([]);
    const [dateOfEvent, setDateOfEvent]:[string, Function] = useState("");
    const [dateOfRelease, setDateOfRelease]:[string, Function] = useState("");

    const getPlaceDatas = (id:string)=>{
        if (id){
            postData(`/venue/${id}`, {token : ParseCookies("long_token")})
            .then((data)=>{
                if (data){
                    for (let i = 0; i < data.seatsDatas.length; i++){
                        data.seatsDatas[i].colorOfSeat = data.colorOfSeat;
                    }
                    setVenueDatas(data);
                }
            });
        }
    }

    const appendToAllSelected = (t:Array<any>)=>{
        let l:Array<string> = [];
        t.forEach(element => {
            for (let i = 0; i < element.seats.length; i++){
                if (!l.includes(element.seats[i])){
                    l.push(element.seats[i]);
                }
            }
        });
        setAll_Selected(l);
    }

    console.log(all_Selected);

    useEffect(()=>{
        postData("/get-venues-in-array", {token : ParseCookies("long_token")})
        .then((datas)=>{
            if (datas.datas){
                setVenues(datas.datas);
            }
            else{

            }
        });
    }, []);

    const changeSelectedVenue = (d:string)=>{
        setSelectedVenue(d);console.log(selectedVenue) ;getPlaceDatas(d);
    }

    const addNewTickets = (datas:typeOfTicket)=>{
        datas.id = uuid();
        setTickets([...tickets, datas]);appendToAllSelected([...tickets, datas]);
    }
    const deleteTicket = (id:string)=>{
        let newDatas = [];
        for (let i = 0; i < tickets.length; i++){
            if (tickets[i].id != id){
                newDatas.push(tickets[i]);
            }
        }
        setTickets(newDatas);
        appendToAllSelected(newDatas);
    }


    const getNowDate = ()=>{
        return `${new Date().getFullYear()}-${new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1}-${new Date().getUTCDate() < 10 ? `0${new Date().getUTCDate()}` : new Date().getUTCDate()}T${new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours()}:${new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()}`;
    }


    return (
        <div className = "create-Event-Settings-Main">
            <InputText title="Rendezvény címe" onChangeFunction={setNameOfEvent} value = {nameOfEvent} />
            <TextArea onChangeFunction={setDescription} title = "Rendezvény leírása" />
            <AddNewButton onClick={()=>{ selectedVenue ? setAddWindow(true) : setAddWindow(false)}} />
            <Calendar onChangeFunction={setDateOfEvent} value = {dateOfEvent} title="Rendezvény dátuma" />
            <Calendar onChangeFunction={setDateOfRelease} value = {getNowDate()} title="Rendevény megjelenése az oldalon" />
            <Select options = {venues} onChangeFunction = {changeSelectedVenue} />
            <ImageUpload onChangeFunction={(path:string)=>{setBackgroundImage(path)}} file = {{fileName : backgroundImage}} deleteFunction = {()=>{setBackgroundImage("")}} className = "create-event-upload-image" title = "Borítókép feltöltése" />
            {addWindow ? <AddTicket closeFunction={()=>{setAddWindow(false)}} idOfVenue = {selectedVenue} datasOfVenue = {venueDatas} saveFunction = {addNewTickets} allSelected = {all_Selected} /> : ""}
            { venueDatas ? <TicketList tickets={tickets} sizeOfArea = {venueDatas.sizeOfArea} sizeOfSeat = {venueDatas.sizeOfSeat} seatDatas = {venueDatas.seatsDatas}/> : "" }
            <SaveButton onClickFunction={()=>{}} />
        </div>
    );
}

export default EventSettings;