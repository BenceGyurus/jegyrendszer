import WindowHeader from "../../../../window-header/windowHeader.component";
import InputText from "../../../../input/inputText.component";
import InputNumber from "../../../../input/inputNumber.component";
import Button from "../../../../buttons/button.component";
import "../../../../../css/add_Ticket.css";
import { useEffect, useState } from "react";
import ShowSeats from "./select_Places.component";
import Group_List from "./groupList.component";
import Window from "../../../../window/window.component";
import { Radio } from "antd";
import TicketType from "../ticketType";
import TicketTypeWindow from "./ticketTypeWindow.component";
import TypeOfTheTicketComponent from "./ticketType.component";

type typeOfAddTicketParams = {
    closeFunction : Function,
    idOfVenue : string,
    datasOfVenue : any,
    saveFunction : Function,
    seatsOfTicket? : Array<string>,
    allSelected : Array<string>,
    id? : string,
    editFunction? : Function,
    numberOfTicket? : number,
    visible ? : boolean,
    ticketTypes ? : Array<TicketType>,
    groupName ? : string
}

const AddTicket = ({closeFunction, datasOfVenue, saveFunction, seatsOfTicket, allSelected, id, editFunction, numberOfTicket, visible, ticketTypes, groupName}:typeOfAddTicketParams)=>{

    console.log(visible);

    const [idOfTicket, setId] = useState(id ? id : "");
    const [seats, setSeats] = useState(false);
    const [idsOfSeats, setIdsOfSeats]:[Array<string>, Function] = useState(seatsOfTicket ? seatsOfTicket : []);
    const [nOfTicket, setNumberOfTicket]:[number, Function] = useState(numberOfTicket ? numberOfTicket : 0); 
    const [usedGroups, setUsedGroups]:[number, Function] = useState(0);
    const [types, setTypes] = useState<Array<TicketType>>(ticketTypes ? ticketTypes : []);
    const [editingType, setEditingType] = useState<TicketType | null | undefined>(null);
    const [addNewType, setAddNewType] = useState(false);
    const [name, setName] = useState<string>(groupName ? groupName : "");



    const removeItem = (array:Array<string>, item:string):Array<string>=>{
        const index = array.indexOf(item);
        if (index !== -1) {
          array.splice(index, 1);
        }
        return array;
    }

    const remove_Seat = (id:string)=>{
        let arr:Array<string> = [...idsOfSeats];
        arr = removeItem(arr, id);
        setIdsOfSeats(arr);
        //allSelected = removeItem(allSelected, id);
        setNumberOfTicket(nOfTicket > 0 ? nOfTicket-1 : nOfTicket);
        setUsedGroups(usedGroups-1);
    }

    const select_Seat = (id:string)=>{
        let arr:Array<string> = [...idsOfSeats];
        if (!idsOfSeats.includes(id)){
            setIdsOfSeats([...arr, id]);
            let n = nOfTicket;
            setNumberOfTicket(n+1);
            setUsedGroups(usedGroups+1);
        }
        else{
            remove_Seat(id);
        }
    }


    const deleteFromAllSelected = (id:string)=>{
        let l = [];
        for (let i = 0; i < allSelected.length; i++){
            if (allSelected[i] !== id){l.push(allSelected[i])}
        }
        return l;
    }



    const appendGroup = (a:any, list:Array<any>)=>{
        if (a){
            let l:Array<string> = [];
            let increment = 0;
            list.forEach(item=>{
                if (!allSelected.includes(item.id) && !idsOfSeats.includes(item.id)) {l.push(item.id);increment++};
            });
            setUsedGroups(usedGroups+increment);
            setIdsOfSeats([...idsOfSeats, ...l]);
            setNumberOfTicket(nOfTicket+increment);
        }
        else{
            let decrement = 0;
            let l = [...idsOfSeats];
            list.forEach(item=>{
                if (idsOfSeats.includes(item.id)) {removeItem(l, item.id);decrement++};
            });
            setUsedGroups(usedGroups-decrement);
            setIdsOfSeats([...l]);
            setNumberOfTicket(nOfTicket-decrement);
        }
    }

    const newAllSelected = ()=>{
        let newList = [];
        if (id){
            for (let i = 0; i < allSelected.length; i++){
                if (!seatsOfTicket?.includes(allSelected[i])){
                    newList.push(allSelected[i]);
                }
            }
            return newList;
        }
        return allSelected;
    }

    const closeTicketTypeWindow = ()=>{setEditingType(null); setAddNewType(false)};

    return (
        <Window closeFunction = {closeFunction} title = "Jegyek hozzáadása" >
            {editingType || addNewType ? <TicketTypeWindow saveFunction={(d:TicketType)=>{setTypes(prev=>[...prev.filter(type=>type.id!=d.id), d]); closeTicketTypeWindow()}} type={editingType} closeFunction={closeTicketTypeWindow} /> : <></>}
            <div className = "add-ticket-div">
                <InputText onChangeFunction={setName} value = {name} title = "Jegy csoport neve" />
            <h3>Jegy típusok hozzáadása</h3>
                <div>
                    {types.map(type=>{
                        return <TypeOfTheTicketComponent ticketType={type} deleteFunction={(id:string)=>{setTypes(prev=>[...prev.filter(type=>type.id!=id)])}} editFunction={(id:string)=>{ setEditingType(types.find(type=>{return type.id===id})) }} />
                    })}
                </div>
            <button onClick={()=>setAddNewType(true)} className = "add-new-ticket-type-button">+</button>
            <InputNumber sufix="db" disabled = {!!idsOfSeats.length} title = "Jegyek száma" onChangeFunction={setNumberOfTicket} value = {nOfTicket > 0 ? nOfTicket : "0"} />
            
            <Button title = "Jegyek kiválasztása" onClickFunction={()=>{setSeats(true)}} />
            {seats ? <ShowSeats closeFunction = {()=>{setSeats(false)} } datasOfVenue = {datasOfVenue} addNewSeat = {select_Seat} seatList = {idsOfSeats} allSelected = {newAllSelected()} /> : ""}
            <Group_List groups={datasOfVenue.groups} seats = {datasOfVenue.seats} changeFunction = {appendGroup} seatList = {newAllSelected()}/>
            <Button title = "Mentés" onClickFunction={()=>{idOfTicket && editFunction ? editFunction({name : name, seats : idsOfSeats, numberOfTicket : nOfTicket, types : types}, idOfTicket) : saveFunction({name : name, seats : idsOfSeats, numberOfTicket : nOfTicket, types : types}); closeFunction()}} />
            </div>
        </Window>
    )
}


export default AddTicket;