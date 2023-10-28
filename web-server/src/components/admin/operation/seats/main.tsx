import { Ref, RefObject, useEffect, useState } from "react"
import Area from "./component/seatArea.component"
import { v4 as uuid } from 'uuid';
import GroupList from "./component/groupList.component";
import DatasToArea from "./component/datasOnArea";
import ShowAllSeats from "./component/showAll.component";
import axios from 'axios';
import Settings from "./component/Settings.component";
import "../../../../css/createNewVenueMain.css";
import SaveButton from "../../../saveButton/saveButton.component";
import VenueDatas from "./component/datasAboutVenue.component";
import Auto_Addition from "./autoAddition";
import SuggestNewGroups from "./component/newGroupSuggestion.component";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import BackButton from "../../../back/backbutton.component";
import Error from "../../../notification/error.component";
import Success from "../../../notification/success.component";
import Notification from "../../../notification/notification.component";
import { Button, notification, Radio, Space } from 'antd';
import Collapse from '@mui/material/Collapse';
import seatOfType from "./type/seat";
import groupType from "./type/group";
import typeOfBackGround from "./type/background";
import typeOfSizeOfArea from "./type/sizeOfArea";


type propsType = {
    seatsDatas? : Array<seatOfType>
    groupsDatas? : Array<groupType>,
    bg? : typeOfBackGround,
    cbg? : string,
    places? : number,
    area? : typeOfSizeOfArea,
    sGroups? : string,
    sOfSeat? : number,
    cOfSeat? : string,
    seatMode? : boolean,
    suGroups? : Array<Array<string>>,
    name?: string,
    id? : string,
    stageData? : number
}

const SeatMain = ({seatsDatas, groupsDatas, bg, cbg, places, area, sGroups, sOfSeat, cOfSeat, seatMode, suGroups, name, id, stageData}:propsType)=>{
    console.log(groupsDatas);
    const [colorOfBackGround, setColorOfBackGround] = useState(cbg ? cbg : "#FFFFFF");
    const [sizeOfArea, setSizeOfArea] = useState(area ? area : {width : 720, height : 480});
    const [background, setBackground] = useState(bg ? bg : {isImage : false, name: colorOfBackGround});
    const [seats, setSeats] = useState(seatsDatas ? seatsDatas : []);
    const [groups, setGroups]:[Array<groupType>, Function] = useState(groupsDatas && groupsDatas.length >= 1 ? groupsDatas : [{name : "Default", posX : 0, posY : 0, id : uuid(), status: false, opened : false}]);
    const [selecttedGroup, setSelectedGroup] = useState(sGroups? sGroups : groups[0].id);
    const [sizeOfSeat, setSizeOfSeat] = useState(sOfSeat ? sOfSeat : 30);
    const [showAllSeats, setShowAllSeats] = useState(false);
    const [showSettingsWindow, setShowSettingsWindow] = useState(false);
    const [colorOfSeat, setColorOfSeat] = useState(cOfSeat ? cOfSeat : "#000000");
    const [turnOnSeats, setTurnOnSeats] = useState(seatMode ? seatMode : false);
    const [positionOfTheAreaFromTop, setPotionOfTheAreaFromTop] = useState(0);
    const [positionOfTheAreaFromLeft, setPotionOfTheAreaFromLeft] = useState(0);
    const [suggestedGroups, setSuggestedGroups] = useState(suGroups ? suGroups : Array<Array<string>>);
    const [nameOfVenue, setNameOfVenue] = useState(name ? name : "");
    const [numberOfPlaces, setNumberOfPlaces] = useState(places ? places : 0);
    const [idOfVenue, setIdOfVenue] = useState(id ? id : "");
    const [stage, setStage] = useState(stageData ? stageData : 0);
    const [error, setError] = useState("");
    const [succ, setSucc] = useState("");
    const [scale, setScale] = useState(false);
    const [action, setAction]:["zoom" | "drag" | "select", Function] = useState("drag")

    const save = ()=>{
        let datas = {
            name : nameOfVenue,
            places : numberOfPlaces,
            colorOfBackGround : colorOfBackGround,
            sizeOfArea : sizeOfArea,
            background : background,
            seatsDatas : seats,
            groups : groups,
            selecttedGroup : selecttedGroup,
            sizeOfSeat : sizeOfSeat,
            colorOfSeat : colorOfSeat,
            seatsMode : turnOnSeats,
            suggestedGroups : suggestedGroups,
            stage : stage
        }
        if (ParseLocalStorage("long_token")){
            postData(`/upload-venue/${idOfVenue}`, {token : ParseLocalStorage("long_token"), datas : datas})
            .then(async (datas)=>{
                if (!datas.error && datas.id && !idOfVenue){
                    if (!id){
                        window.location.href = `/admin/terem-szerkesztes/${datas.id}`;
                        setSucc("Sikeres mentés");
                    }
                }
                else if(!datas.error && datas.id){
                    setSucc("Sikeres mentés");
                }
                else{
                    if (datas.responseData){
                        datas = await datas.responseData;
                    }
                    setError(datas.message);
                }
            });
        }

    }


    const relativeSeatPosition = (posX:number, posY:number)=>{
        return {posX : posX-positionOfTheAreaFromLeft, posY:posY-positionOfTheAreaFromTop};
    }

    const absolutePosition = (posX:number, posY:number)=>{
        //return {posX : posX+positionOfTheAreaFromLeft, posY:posY+positionOfTheAreaFromTop};
        return {posX : posX, posY:posY}
    }

    const getAbsoluteSeats = ()=>{
        let absolteSeats:Array<seatOfType> = [];
        for (let i = 0; i < seats.length; i++){
            let {posX, posY} = absolutePosition(seats[i].posX, seats[i].posY);
            absolteSeats.push({...seats[i], posX : posX, posY});
        }
        return absolteSeats;
    }

    const getNewArray = (array:Array<seatOfType>):Array<seatOfType>=>{
        let newArray:Array<seatOfType> = [];
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
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        let newData = [...seats];
        newData.push({posX : relativeSeatPosition(posX, posY).posX, posY : relativeSeatPosition(posX, posY).posY, name : name, title : title, id : uuid(), group: selecttedGroup});
        setSeats(newData);
    }

    const addNewGroup = (name:string, posX:number, posY:number)=>{
        let newData = [...groups];
        let id = uuid();
        newData.push({name : name,id : id ,posX : posX, posY : posY, status : false, opened: false});
        setGroups(newData);
    }

    const setStatusOfGroup = (index:number, status:boolean)=>{
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        let newData = [...groups];
        newData[index] = ({name : newData[index].name,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : status, opened : newData[index].opened});
        setGroups(newData);
    }

    const editNameOfGroup = (index:number,name:string)=>{
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        let newData = [...groups];
        newData[index] = ({name : name ,id : newData[index].id ,posX : newData[index].posX, posY : newData[index].posY, status : false, opened : newData[index]?.opened});
        setGroups(newData);
    }

    const deleteGroup = (index:number)=>{
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        if (groups.length > 1){
        let newData:Array<groupType> = [];
        let newSeats:Array<seatOfType> = [];
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

    const changeValueOfSeat = (name:string, index:number)=>{
        let newData = [...seats];
        newData[index] = ({posX : newData[index].posX, posY : newData[index].posY, name : name, title : newData[index].title, id : newData[index].id, group: newData[index].group});
        setSeats(newData);
    }

    const deleteSeat = (index:number)=>{
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        let newData = [...seats];
        delete newData[index];
        newData = getNewArray(newData);
        setSeats(newData);
    }

    const newPositionToSeat = (index:number ,posX:number, posY:number, event:Event)=>{
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        let newData = [...seats];
        if (newData[index].posX + posX + positionOfTheAreaFromLeft + (sizeOfSeat-5) <= positionOfTheAreaFromLeft + sizeOfArea.width && newData[index].posX + posX + positionOfTheAreaFromLeft > positionOfTheAreaFromLeft && positionOfTheAreaFromTop < (posY + newData[index].posY + positionOfTheAreaFromTop) && newData[index].posY + posY + positionOfTheAreaFromTop + (sizeOfSeat-5) <= positionOfTheAreaFromTop + sizeOfArea.height){
            newData[index] = ({posX : newData[index].posX + posX, posY : newData[index].posY + posY, name : newData[index].name, title : newData[index].title, id : newData[index].id, group: newData[index].group});
        }
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

    const uploadFile = (name:string, width:number, height:number)=>{
        /*const data = new FormData() ;
        data.append('file', event.target.files[0]);
        axios.post(`/upload-image/${ParseLocalStorage("long_token")}`, data)
        .then(res => { // then print response status
            setBackground({isImage : true, name : res.data.path});
            if (res.data.width && res.data.height){
                setSizeOfArea({width : res.data.width, height : res.data.height});
            }
    })*/
    setBackground({isImage : true, name : name});
    setSizeOfArea({width : width, height : height});

    }

    const setWidthOfArea = (width:number, heightRef:RefObject<null>, widthRef:RefObject<null>)=>{
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

    const addMoreGroups = (grouplist:Array<groupType>)=>{
        let {detectedGroups, recommendedGroups} = Auto_Addition(seats, sizeOfSeat);
        setSuggestedGroups(recommendedGroups);
        let newData = [...groups, ...grouplist];
        setGroups(newData);
    }

    const changeTitleOfSeat = (index:number,title:string)=>{
        let l = [...seats];
        l[index].title = title;
        setSeats(l);
    }

    console.log(turnOnSeats);

    return (
        <div>
            <Error setOpen={()=>{setError("")}} message={error} open = {error != ""} />
            {succ ? <Notification element={<Success closeFunction={()=>{setSucc("")}} message = {succ} />} /> : ""}
            <div className = "back-button-locate-div">
                <BackButton url = "/admin/termek" />
            </div>
        <VenueDatas nameOfVenue={nameOfVenue} numberOfPlaces = {numberOfPlaces} seatsStatus = {turnOnSeats} onChangeFunction = {setTurnOnSeats} changeName = {setNameOfVenue} changeNumberOfPlaces = {setNumberOfPlaces} />
        <Collapse in={turnOnSeats}><div>
        <Radio.Group optionType="button" buttonStyle="solid" options={[{label : <i className="fas fa-mouse-pointer"></i>, value : "drag"}, {label : <i className="fas fa-object-group"></i>, value : "select"}, {label : <i className="fas fa-search-plus"></i>, value : "zoom"}]} onChange={e=>setAction(e.target.value)} value={action} />
        <Area action={action} width = {!background.isImage ? sizeOfArea.width : sizeOfArea.width} height = {!background.isImage ? sizeOfArea.height : sizeOfArea.height} background = {background} clickEvent = {addNewSeat} size = {sizeOfSeat} posYOfArea = {setPotionOfTheAreaFromTop} posXOfArea = {setPotionOfTheAreaFromLeft}>
        <DatasToArea suggestedGroups = {suggestedGroups} groups={groups} seats = {getAbsoluteSeats()} size = {sizeOfSeat} selected = {selecttedGroup} newPositionFunction = {newPositionToSeat} showAll = {showAllSeats} colorOfSeat = {colorOfSeat}/>
        </Area>
        <ShowAllSeats showAll = {showAllSeats} onChangeFunction = {changeStatusOfShowAll}/>
        <GroupList groups = {groups} handleEvent = {editNameOfGroup} editFunction = {setStatusOfGroup} deleteEvent = {deleteGroup} setSelected = {setSelectedInGroups} selected = {selecttedGroup} seats = {seats} changeValue = {changeValueOfSeat} deleteSeatFunction = {deleteSeat} changeOpened = {changeStatusOfOpened} changeTitle={changeTitleOfSeat}/>
        <Settings setScale={setScale} scale = {scale} showSettingsWindow = {showSettingsWindow} widthOfArea={sizeOfArea.width} heightOfArea = {sizeOfArea.height} setHeightOfArea = {setHeightOfArea} setWidthOfArea = {setWidthOfArea} setSizeOfSeatsFunction = {(size:number) =>{setSizeOfSeat(size > 0 ? size : 1)}} sizeOfSeat = {sizeOfSeat} uploadFile = {uploadFile} delteImageFunction = {deleteImage} settingsWindow = {ChangeSettingsWindow} colorOfBackground = {colorOfBackGround} setColorOfBackground = {changeColorOfBackground} colorOfSeat = {colorOfSeat} changeColorOfSeats = {setColorOfSeat} nameOfBackgroundImage = {background} newGroupFunction = {addNewGroup} setSelectedStage = {setStage} selectedStage={stage}/>
        
        <SuggestNewGroups suggestedGroups = {suggestedGroups} seats = {seats} changeSeatsFunctions = {setSeats} addGroupsFunction = {addMoreGroups} groups = {groups} open= {suggestedGroups.length>0} setOpen={()=>{setSuggestedGroups([])}} />
        
        </div></Collapse>
        <SaveButton onClickFunction={save}/>
        </div>
    );
}

export default SeatMain;