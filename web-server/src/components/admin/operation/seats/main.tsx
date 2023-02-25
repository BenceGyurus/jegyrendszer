import { useEffect, useState } from "react"
import Area from "./component/seatArea.component"
import { v4 as uuid } from 'uuid';
import NewGroup from "./component/newGroup.component";
import GroupList from "./component/groupList.component";
import DatasToArea from "./component/datasOnArea";
import ShowAllSeats from "./component/showAll.component";
import ImageUpload from "./component/uploadImage";
import axios from 'axios';
import Settings from "./component/Settings.component";
import "../../../../css/createNewVenueMain.css";

type groupType = {
    name : string,
    id : string,
    posX : number,
    posY : number,
    status : boolean,
    opend: boolean
}

type seatOfType = {
    name : string,
    title : string,
    id : string,
    posX : number,
    posY : number,
    group : string
}

type propsType = {
    seatsDatas : Array<seatOfType>
    groupsDatas : any
}

const SeatMain = ({seatsDatas, groupsDatas}:propsType)=>{
    const [colorOfBackGround, setColorOfBackGround] = useState("#808080");
    const [sizeOfArea, setSizeOfArea] = useState({width : 720, height : 480});
    const [background, setBackground] = useState({isImage : false, name: colorOfBackGround});
    const [seats, setSeats] = useState(seatsDatas);
    const [groups, setGroups] = useState(groupsDatas.length >= 1 ? groupsDatas : [{name : "Default", posX : 0, posY : 0, id : uuid(), status: false, opened : false}]);
    const [selecttedGroup, setSelectedGroup] = useState(groups[0].id);
    const [sizeOfSeat, setSizeOfSeat] = useState(8);
    const [showAllSeats, setShowAllSeats] = useState(false);
    const [showSettingsWindow, setShowSettingsWindow] = useState(false);
    const [colorOfSeat, setColorOfSeat] = useState("#000000");

    const getNewArray = (array:Array<unknown>):Array<seatOfType>=>{
        let newArray:any = [];
        for (let i = 0; i < array.length; i++){
            if (array[i]){
                newArray.push(array[i]);
            }
        }
        return newArray;
    }

    const changeColorOfBackground = (color:string)=>{
        if (color.length === 7){
        setColorOfBackGround(`${color}`);
        if (!background.isImage){
            let newColor = {...background};
            newColor.name = colorOfBackGround;
            setBackground(newColor);
        }
        }
    }

    const addNewSeat = (posX:number, posY:number, name:string, title:string)=>{
        let newData = [...seats];
        newData.push({posX : posX, posY : posY, name : name, title : title, id : uuid(), group: selecttedGroup});
        setSeats(newData);
    }

    const addNewGroup = (name:string, posX:number, posY:number)=>{
        let newData = [...groups];
        newData.push({name : name,id : uuid() ,posX : posX, posY : posY, status : false, opened: false});
        setGroups(newData);
    }

    const setStatusOfGroup = (index:number, status:boolean)=>{
        let newData = [...groups];
        newData[index] = ({name : newData[index].name,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : status, opened : newData[index].opened});
        setGroups(newData);
    }

    const editNameOfGroup = (index:number,name:string)=>{
        let newData = [...groups];
        newData[index] = ({name : name ,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : false, opened : newData[index].opened});
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

    const deleteSeat = (index:number)=>{
        let newData = [...seats];
        delete newData[index];
        newData = getNewArray(newData);
        setSeats(newData);
    }

    const newPositionToSeat = (index:number ,posX:number, posY:number)=>{
        let newData = [...seats];
        console.log(newData[index].posX, newData[index].posY, posX, posY);
        newData[index] = ({posX : newData[index].posX + posX, posY : newData[index].posY + posY, name : newData[index].name, title : newData[index].title, id : newData[index].id, group: newData[index].group});
        setSeats(newData); 
    }

    const changeStatusOfOpened = (index:number,status:boolean)=>{
        let newData = [...groups];
        newData[index] = ({name : newData[index].name ,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : false, opened : status});
        setGroups(newData);
    }

    const changeStatusOfShowAll = (status:boolean)=>{
        setShowAllSeats(status);
    }

    const uploadFile = (event:any)=>{
        const data = new FormData() ;
        data.append('file', event.target.files[0]);
        axios.post("/upload-backgroumd-image-to-venue", data)
        .then(res => { // then print response status
            setBackground({isImage : true, name : res.data.path});
            if (res.data.width && res.data.height){
                setSizeOfArea({width : res.data.width, height : res.data.height});
            }
    })

    }

    const setWidthOfArea = (width:number, scale:boolean, heightRef:any, widthRef:any)=>{
        let sizeData = {...sizeOfArea};
        if (width <= 0){
            width = 0.9;
        }
        if (scale && width > 0 && sizeData.width){
            sizeData.height = (width/sizeData.width)*sizeData.height;
        }
        sizeData.width = width;
        setSizeOfArea(sizeData);
    }

    const setHeightOfArea = (height:number)=>{
        let sizeData = {...sizeOfArea};
        sizeData.height = height > 0 ? height : 0.9;
        setSizeOfArea(sizeData);
    }

    const deleteImage = ()=>{
        setBackground({isImage : false, name : colorOfBackGround});
    }

    const ChangeSettingsWindow = ()=>{
        setShowSettingsWindow(!showSettingsWindow);
    }

    console.log(showSettingsWindow);

    return (
        <div>
        <Area width = {!background.isImage ? sizeOfArea.width : sizeOfArea.width} height = {!background.isImage ? sizeOfArea.height : sizeOfArea.height} background = {background} clickEvent = {addNewSeat} size = {sizeOfSeat}>
        <DatasToArea groups={groups} seats = {seats} size = {sizeOfSeat} selected = {selecttedGroup} newPositionFunction = {newPositionToSeat} showAll = {showAllSeats} colorOfSeat = {colorOfSeat}/>
        </Area>
        <ShowAllSeats showAll = {showAllSeats} onChangeFunction = {changeStatusOfShowAll}/>
        <GroupList groups = {groups} handleEvent = {editNameOfGroup} editFunction = {setStatusOfGroup} deleteEvent = {deleteGroup} setSelected = {setSelectedInGroups} selected = {selecttedGroup} seats = {seats} changeValue = {changeValueOfSeat} deleteSeatFunction = {deleteSeat} changeOpened = {changeStatusOfOpened}/>
        <Settings showSettingsWindow = {showSettingsWindow} widthOfArea={sizeOfArea.width} heightOfArea = {sizeOfArea.height} setHeightOfArea = {setHeightOfArea} setWidthOfArea = {setWidthOfArea} setSizeOfSeatsFunction = {(size:number) =>{setSizeOfSeat(size > 0 ? size : 1)}} sizeOfSeat = {sizeOfSeat} uploadFile = {uploadFile} delteImageFunction = {deleteImage} settingsWindow = {ChangeSettingsWindow} colorOfBackground = {colorOfBackGround} setColorOfBackground = {changeColorOfBackground} colorOfSeat = {colorOfSeat} changeColorOfSeats = {setColorOfSeat} nameOfBackgroundImage = {background} newGroupFunction = {addNewGroup}/>
        </div>
    );
}

export default SeatMain;