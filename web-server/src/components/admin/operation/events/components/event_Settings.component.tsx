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
import ParseLocalStorage from "../../../../../cookies/ParseLocalStorage";
import ImageUpload from "../../../../image-upload/imageUpload.component";
import { v4 as uuid } from 'uuid';
import TicketList from "./ticketList.component";
import Calendar from "../../../../calendar/calendar.component";
import Error from "../../../../notification/error.component";
import BackButton from "../../../../back/backbutton.component";

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

type typeOfEventSettingsParams = {
    name? : string,
    description? : string,
    tickets_? : any,
    background? : string,
    dOfEvent? : string,
    dOfRelease? : string,
    venue? : string
}

const EventSettings = ( { name, description, tickets_, background, dOfEvent, dOfRelease, venue }:typeOfEventSettingsParams )=>{

    const [id, setId]:[string, Function] = useState(window.location.pathname.split("/")[3]);
    const [nameOfEvent, setNameOfEvent]:[string, Function] = useState(name ? name : "");
    const [desciption, setDescription]:[string, Function] = useState(description ? description : "");
    const [addWindow, setAddWindow]:[boolean, Function] = useState(false);
    const [tickets, setTickets]:[Array<any>, Function] = useState(tickets_ ? tickets_ : []);
    const [selectedVenue, setSelectedVenue]:[string, Function] = useState(venue ? venue : "");
    const [venues, setVenues]:[Array<{value : string, title : string}>, Function] = useState([]);
    const [backgroundImage, setBackgroundImage]:[string, Function] = useState(background ? background : ""); 
    const [venueDatas, setVenueDatas]:any = useState();
    const [all_Selected, setAll_Selected]:[Array<string>, Function] = useState([]);
    const [dateOfEvent, setDateOfEvent]:[string, Function] = useState(dOfEvent ? dOfEvent : "");
    const [dateOfRelease, setDateOfRelease]:[string, Function] = useState(dOfRelease ? dOfRelease : "");
    const [editTicket, setEditTicket]:[any, Function] = useState(false);



    const getPlaceDatas = (id:string)=>{
        if (id){
            postData(`/venue/${id}`, {token : ParseLocalStorage("long_token")})
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

    useEffect(()=>{
        postData("/get-venues-in-array", {token : ParseLocalStorage("long_token")})
        .then((datas)=>{
            if (datas.datas){
                setVenues(datas.datas);
            }
            else{

            }
        });
        if (selectedVenue){
            getPlaceDatas(selectedVenue);
        }
    }, []);

    const changeSelectedVenue = (d:string)=>{
        setSelectedVenue(d) ;getPlaceDatas(d);
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


    const save = ()=>{
        let sendData = {
            name : nameOfEvent,
            description : desciption,
            tickets : tickets,
            background : backgroundImage,
            dateOfEvent : dateOfEvent,
            dateOfRelease : dateOfRelease ? dateOfRelease : getNowDate(),
            venue : selectedVenue
        };

        postData(`/add-event${id ? `/${id}` : ""}`, {data : sendData, token : ParseLocalStorage("long_token")})
        .then(async (data)=>{
            if (data.datas){
                <Error message={(await data.datas).message} />
            }
            else if (data.id && !id){
                window.location.pathname += `/${data.id}`;
            }
        })
    }


    const edit_Ticket = (id:string)=>{
        for (let i = 0; i < tickets.length; i++){
            if (tickets[i].id === id){
                setEditTicket(tickets[i]);
            }
        }
    }

    const saveEditedTicket = (datas:any, id:string)=>{
        let l = [];
        for (let i = 0; i < tickets.length; i++){
            if (id == tickets[i].id){
                l.push({...datas, id : id});
            }else{
                l.push(tickets[i]);
            }
        }
        appendToAllSelected(l);
        setTickets(l);
    }


    const reload_All_Selected = ()=>{
        let l = [];
        for (let i = 0; i < tickets.length; i++){
            for (let j = 0; j < tickets[i].seats.length; j++){
                l.push(tickets[i].seats[j]);
            }
        }
        setAll_Selected(l);
    }


    return (
        <div>
        <BackButton url="/admin/rendezvenyek" className = "create-event-back-button" />
        <div className = "create-Event-Settings-Main">
            <InputText title="Rendezvény címe" onChangeFunction={setNameOfEvent} value = {nameOfEvent} />
            <TextArea onChangeFunction={setDescription} title = "Rendezvény leírása" value = {desciption} />
            <AddNewButton onClick={()=>{reload_All_Selected(); selectedVenue ? setAddWindow(true) : setAddWindow(false)}} />
            <Calendar onChangeFunction={setDateOfEvent} value = {dateOfEvent} title="Rendezvény dátuma" />
            <Calendar onChangeFunction={setDateOfRelease} value = {getNowDate()} title="Rendevény megjelenése az oldalon" />
            <Select title = "Helyszín kiválasztása" options = {venues} onChangeFunction = {changeSelectedVenue} value = {selectedVenue} />
            <ImageUpload onChangeFunction={(path:string)=>{setBackgroundImage(path)}} file = {{fileName : backgroundImage}} deleteFunction = {()=>{setBackgroundImage("")}} className = "create-event-upload-image" title = "Borítókép feltöltése" />
            {(addWindow || editTicket) && venueDatas ? <AddTicket closeFunction={()=>{setAddWindow(false); setEditTicket(false)}} idOfVenue = {selectedVenue} datasOfVenue = {venueDatas} saveFunction = {addNewTickets} allSelected = {all_Selected} nameOfTicket={editTicket ? editTicket.name : ""} priceOfTicket={editTicket ? editTicket.price : ""} minPriceOfTicket={editTicket ? editTicket.minPrice : ""} maxPriceOfTicket={editTicket ? editTicket.maxPrice : ""} seatsOfTicket={editTicket ? editTicket.seats : ""} id={editTicket ? editTicket.id : ""} editFunction={saveEditedTicket} numberOfTicket={editTicket ? editTicket.numberOfTicket : 0} /> : ""}
            { venueDatas ? <TicketList tickets={tickets} sizeOfArea = {venueDatas.sizeOfArea} sizeOfSeat = {venueDatas.sizeOfSeat} seatDatas = {venueDatas.seatsDatas} deleteFunction = {deleteTicket} editFunction = {edit_Ticket}/> : "" }
            <SaveButton onClickFunction={save} />
        </div>
        </div>
    );
}

export default EventSettings;