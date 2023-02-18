import { useState } from "react"
import Area from "./component/seatArea.component"
import Seat from "./component/seat.component"
import { v4 as uuid } from 'uuid';
import NewGroup from "./component/newGroup.component";
import GroupList from "./component/groupList.component";

type groupType = {
    name : string,
    id : string,
    posX : number,
    posY : number,
    status : boolean
}

type seatOfType = {
    name : string,
    title : string,
    id : string,
    posX : number,
    posY : number,
    group : string
}

const SeatMain = ()=>{
    const [sizeOfArea, setSizeOfArea] = useState({width : 500, height : 500});
    const [background, setBackground] = useState({isImage : false, name: "gray", height : 800, width: 1200});
    const [seats, setSeats] = useState(Array<seatOfType>);
    const [groups, setGroups] = useState([{name : "Default", posX : 0, posY : 0, id : uuid(), status: false}]);
    const [selecttedGroup, setSelectedGroup] = useState(groups[0].id);
    const [sizeOfSeat, setSizeOfSeat] = useState(10);

    const addNewSeat = (posX:number, posY:number, name:string, title:string)=>{
        let newData = [...seats];
        newData.push({posX : posX, posY : posY, name : name, title : title, id : uuid(), group: selecttedGroup});
        setSeats(newData);
    }

    const addNewGroup = (name:string, posX:number, posY:number)=>{
        let newData = [...groups];
        newData.push({name : name,id : uuid() ,posX : posX, posY : posY, status : false});
        setGroups(newData);
    }

    const setStatusOfGroup = (index:number, status:boolean)=>{
        let newData = [...groups];
        newData[index] = ({name : newData[index].name,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : status});
        setGroups(newData);
    }

    const editNameOfGroup = (index:number,name:string)=>{
        let newData = [...groups];
        newData[index] = ({name : name ,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : false});
        setGroups(newData);
    }

    const deleteGroup = (index:number)=>{
        if (groups.length > 1){
        let newData:any = [];
        let newSeats:any = [];
        let id:string = "";
        for (let i = 0; i < groups.length; i++){
            if (i != index){
                newData.push(groups[i]);
            }else{
                id = groups[i].id
            }
        }
        for (let i = 0; i <seats.length; i++){
            if (seats[i].group != id){
                newSeats.push(seats[i])
            }
        }
        setSeats(newSeats);
        setGroups(newData);
        }
    }

    const setSelectedInGroups = (index:number)=>{
        setSelectedGroup(groups[index].id);
    }

    const changeValueOfSeat = (index:number, name:string)=>{
        let newData = [...seats];
        newData[index] = ({posX : newData[index].posX, posY : newData[index].posY, name : name, title : newData[index].title, id : newData[index].id, group: newData[index].group});
        setSeats(newData);
    }

    console.log(seats);

    return (
        <div>
        <Area width = {!background.isImage ? sizeOfArea.width : background.width} height = {!background.isImage ? sizeOfArea.height : background.height} background = {background} clickEvent = {addNewSeat}>

        </Area>
        <GroupList groups = {groups} handleEvent = {editNameOfGroup} editFunction = {setStatusOfGroup} deleteEvent = {deleteGroup} setSelected = {setSelectedInGroups} selected = {selecttedGroup} seats = {seats} changeValue = {changeValueOfSeat}/>
        <NewGroup addNewFunction={addNewGroup}/>
        </div>
    );
}

export default SeatMain;