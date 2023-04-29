import WindowHeader from "../../../../window-header/windowHeader.component";
import InputText from "../../../../input/inputText.component";
import InputNumber from "../../../../input/inputNumber.component";
import Button from "../../../../buttons/button.component";
import "../../../../../css/add_Ticket.css";
import { useEffect, useState } from "react";
import ShowSeats from "./select_Places.component";
import Group_List from "./groupList.component";

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
    allSelected : Array<string>
}

const AddTicket = ({closeFunction, datasOfVenue, saveFunction, nameOfTicket, priceOfTicket, minPriceOfTicket, maxPriceOfTicket, seatsOfTicket, allSelected}:typeOfAddTicketParams)=>{

    const [seats, setSeats] = useState(false);
    const [idsOfSeats, setIdsOfSeats]:[Array<string>, Function] = useState(seatsOfTicket ? seatsOfTicket : []);
    const [price, setPrice]:[number, Function] = useState(priceOfTicket ? priceOfTicket : 0);
    const [minPrice, setMinPrice]:[number, Function] = useState(minPriceOfTicket ? minPriceOfTicket : 0);
    const [maxPrice, setMaxPrice]:[number, Function] = useState(maxPriceOfTicket ? maxPriceOfTicket : 0);
    const [name, setName]:[string, Function] = useState(nameOfTicket ? nameOfTicket : "");
    const [nOfTicket, setNumberOfTicket]:[number, Function] = useState(0); 


    const select_Seat = (id:string)=>{
        if (idsOfSeats.includes(id)){
            let l = [...idsOfSeats];
            let newList:Array<string> = [];
            l.forEach((element)=>{
                if (element != id){
                    newList.push(element);
                }
            })
            setIdsOfSeats(newList);
            changeNumberOfTicket(false, 1);
        }
        else{
            let l = [...idsOfSeats, id];
            setIdsOfSeats(l);
            changeNumberOfTicket(true, 1);
        }
    }

    const changeNumberOfTicket = (status:boolean, n:number|null)=>{
        let l = nOfTicket;
        console.log(n);
        if (status){
            setNumberOfTicket(n ? l+n: l+1);
        }else{
            setNumberOfTicket(n ? l-n: l-1);
        }
        
        
    }

    const appendGroup = (a:any, list:Array<any>)=>{
        if (a){
            let l = [...idsOfSeats];
            list.forEach((element)=>{
                if (!allSelected.includes(element.id)){
                    l.push(element.id);
                }
            })
            changeNumberOfTicket(true, l.length);
            setIdsOfSeats([...idsOfSeats, ...l]);
        }
        else{
            let newList:any = [];
            let a = 0;
            let l = [...idsOfSeats];
            for (let i = 0; i < list.length; i++){
                for (let j = 0; j < l.length; j++){
                    if (list[i].id === l[j]){
                        delete l[j];
                        a++;
                    }
                }
            }
            changeNumberOfTicket(false, a);
            for (let i = 0; i < l.length; i++){
                if (l[i]){
                    newList.push(l[i]);
                }
            }
            setIdsOfSeats(newList);
        }
    }


    console.log("idsOfSeats", idsOfSeats);

    return (
        <div className = "add-ticket-window">
            <WindowHeader title="Jegy hozzáadása" closeWindowFunction={closeFunction}/>
            <div className = "add-ticket-div">
            <InputText title = "Jegy neve" onChangeFunction={setName} value = {name} />
            <InputNumber title = "Jegy alapára" onChangeFunction={setPrice} value = {price} />
            <InputNumber title="Maximum jegyár" onChangeFunction={setMaxPrice} value = {maxPrice} />
            <InputNumber title = "Minimum jegyár" onChangeFunction={setMinPrice} value = {minPrice} />
            <InputNumber title = "Jegyek száma" onChangeFunction={setNumberOfTicket} value = {nOfTicket > 0 ? nOfTicket : "0"} />
            <Button title = "Jegyek kiválasztása" onClickFunction={()=>{setSeats(true)}} />
            {seats ? <ShowSeats closeFunction = {()=>{setSeats(false)} } datasOfVenue = {datasOfVenue} addNewSeat = {select_Seat} seatList = {idsOfSeats} allSelected = {allSelected} /> : ""}
            <Group_List groups={datasOfVenue.groups} seats = {datasOfVenue.seatsDatas} changeFunction = {appendGroup} seatList = {allSelected}/>
            <Button title = "Mentés" onClickFunction={()=>{saveFunction({name : name, price : price, minPrice : minPrice, maxPrice : maxPrice, seats : idsOfSeats}); closeFunction()}} />
            </div>

        </div>
    )
}

export default AddTicket;