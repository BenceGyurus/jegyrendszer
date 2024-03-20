import WindowHeader from "../../../../window-header/windowHeader.component";
import InputText from "../../../../input/inputText.component";
import InputNumber from "../../../../input/inputNumber.component";
import Button from "../../../../buttons/button.component";
import "../../../../../css/add_Ticket.css";
import { useEffect, useState } from "react";
import ShowSeats from "./select_Places.component";
import Group_List from "./groupList.component";
import Window from "../../../../window/window.component";

type typeOfAddTicketParams = {
    closeFunction : Function,
    idOfVenue : string,
    datasOfVenue : any,
    saveFunction : Function,
    nameOfTicket? : string,
    priceOfTicket?: number,
    maxPriceOfTicket? : number,
    minPriceOfTicket? : number,
    seatsOfTicket? : Array<string>,
    allSelected : Array<string>,
    id? : string,
    editFunction? : Function,
    numberOfTicket? : number
}

const AddTicket = ({closeFunction, datasOfVenue, saveFunction, nameOfTicket, priceOfTicket, minPriceOfTicket, maxPriceOfTicket, seatsOfTicket, allSelected, id, editFunction, numberOfTicket}:typeOfAddTicketParams)=>{

    const [idOfTicket, setId] = useState(id ? id : "");
    const [seats, setSeats] = useState(false);
    const [idsOfSeats, setIdsOfSeats]:[Array<string>, Function] = useState(seatsOfTicket ? seatsOfTicket : []);
    const [price, setPrice]:[number, Function] = useState(priceOfTicket ? priceOfTicket : 0);
    const [minPrice, setMinPrice]:[number, Function] = useState(minPriceOfTicket ? minPriceOfTicket : 0);
    const [maxPrice, setMaxPrice]:[number, Function] = useState(maxPriceOfTicket ? maxPriceOfTicket : 0);
    const [name, setName]:[string, Function] = useState(nameOfTicket ? nameOfTicket : "");
    const [nOfTicket, setNumberOfTicket]:[number, Function] = useState(numberOfTicket ? numberOfTicket : 0); 
    const [usedGroups, setUsedGroups]:[number, Function] = useState(0);

      
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

    console.log(datasOfVenue);

    return (
        <Window closeFunction = {closeFunction} title = "Jegyek hozzáadása" >
            <div className = "add-ticket-div">
            <InputText title = "Jegy neve" onChangeFunction={setName} value = {name} info={{text : "A jegyhez tartózó név, ami megjelenik az oldalon is.", image : "/images/info/ticket-name.png"}} />
            <InputNumber money = {true} title = "Jegy alapára" onChangeFunction={setPrice} value = {price} />
            <InputNumber money = {true} title="Maximum jegyár" onChangeFunction={setMaxPrice} value = {maxPrice} />
            <InputNumber money = {true} title = "Minimum jegyár" onChangeFunction={setMinPrice} value = {minPrice} />
            <InputNumber sufix="db" disabled = {!!idsOfSeats.length} title = "Jegyek száma" onChangeFunction={setNumberOfTicket} value = {nOfTicket > 0 ? nOfTicket : "0"} />
            <Button title = "Jegyek kiválasztása" onClickFunction={()=>{setSeats(true)}} />
            {seats ? <ShowSeats closeFunction = {()=>{setSeats(false)} } datasOfVenue = {datasOfVenue} addNewSeat = {select_Seat} seatList = {idsOfSeats} allSelected = {newAllSelected()} /> : ""}
            <Group_List groups={datasOfVenue.groups} seats = {datasOfVenue.seats} changeFunction = {appendGroup} seatList = {newAllSelected()}/>
            <Button title = "Mentés" onClickFunction={()=>{idOfTicket && editFunction ? editFunction({name : name, price : price, minPrice : minPrice, maxPrice : maxPrice, seats : idsOfSeats, numberOfTicket : nOfTicket}, idOfTicket) : saveFunction({name : name, price : price, minPrice : minPrice, maxPrice : maxPrice, seats : idsOfSeats, numberOfTicket : nOfTicket}); closeFunction()}} />
            </div>
        </Window>
    )
}

export default AddTicket;