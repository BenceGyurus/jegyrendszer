import { useState, useEffect, useRef } from "react";
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
import AddMedia from "./add-media.component";
import MarkerMap from "../../../../map/create-marker-map.component";
import Checkbox from "../../../../checkbox/checkbox.component";
import UsersList from "./usersList.component";
import AvatarGroup from '@mui/material/AvatarGroup';
import StringAvatar from "../../../../avatar/avatar.component";
import { Tooltip } from 'react-tooltip'
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import TimeLine from "./timeLine.component";
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { Button } from 'antd';
import { Statistic } from 'antd';

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
    suggestedGroups : Array<string>

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
    venue? : string,
    mediaDatas? : typeOfMedia,
    location? : string,
    company? : string,
    markerPosition? : typeOfCenter,
    localD? : boolean,
    usersList? : Array<string>,
    contributors? : Array<string>,
    addre? : string,
    open? : string,
    end? : string,
    isWardrobe? : boolean,
    versions? : any,
    readable_event_name? : string
}

type typeOfMedia = {
    apple_music? : string,
    spotify? : string,
    youtube? : string,
    facebook? : string,
    instagram? : string
}

type typeOfCompanyList = {
    title : string,
    value : string
}

type typeOfCenter = {
    lat : number,
    lng : number
}

type typeOfUsers = {
    username : string,
    _id : string
}
const EventSettings = ( { name, description, tickets_, background, dOfEvent, dOfRelease, venue, mediaDatas, location, company, markerPosition, localD, usersList, contributors,addre, open, end, isWardrobe, versions, readable_event_name}:typeOfEventSettingsParams )=>{
    const parse_Media_Datas = (mediaDatas:any)=>{
        for (let i = 0; i < Object.keys(mediaDatas).length; i++){
            if (mediaDatas[Object.keys(mediaDatas)[i]]){
                mediaDatas[Object.keys(mediaDatas)[i]] = mediaDatas[Object.keys(mediaDatas)[i]].replaceAll("!equal!", "=")
                mediaDatas[Object.keys(mediaDatas)[i]] = mediaDatas[Object.keys(mediaDatas)[i]].replaceAll("!end!" , "&");
            }
        }
        return mediaDatas;
    }

    const getNowDate = ()=>{
        return `${new Date().getFullYear()}-${new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1}-${new Date().getUTCDate() < 10 ? `0${new Date().getUTCDate()}` : new Date().getUTCDate()}T${new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours()}:${new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()}`;
    }

    const [openTour, setOpenTour] = useState<boolean>(true);
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
    const [dateOfRelease, setDateOfRelease]:[string, Function] = useState(dOfRelease ? dOfRelease : getNowDate());
    const [editTicket, setEditTicket]:[any, Function] = useState(false);
    const [media, setMedia]:[typeOfMedia, Function] = useState(mediaDatas ? parse_Media_Datas(mediaDatas) : {apple_music : "", spotify : "", youtube : "", facebook : "", instagram : ""});
    const [locationOfEvent, setLocationOfEvent]:[string, Function] = useState(location ? location : "");
    const [companyList, setCompanyList]:[Array<typeOfCompanyList>, Function] = useState([]);
    const [selectedCompany, setSelectedCompany]:[string, Function] = useState(company ? company : "");
    const [position, setPostion]:[typeOfCenter, Function] = useState(markerPosition ? markerPosition : {lat : 47.2367, lng : 16.621456});
    const [localDiscounts, setLocalDiscounts]:[boolean, Function] = useState(localD ? localD : false);
    const [users, setUsers]:[Array<typeOfUsers>, Function] = useState([]);
    const [selectedUsers, setSelectedUsers]:[Array<string>, Function] = useState(usersList ? usersList : []);
    const [isLoading, setIsLoading]:[boolean, Function] = useState(false);
    const [successSave, setSuccessSave]:[boolean, Function] = useState(false);
    const [address, setAddress]:[string, Function] = useState(addre ? addre : "");
    const [gateOpening, setGateOpening]:[string, Function] = useState(open ? open : "");
    const [endOfTheEvent, setEndOfTheEvent]:[string, Function] = useState(end ? end : "");
    const [wardrobe, setWardrobe]:[boolean, Function] = useState(isWardrobe ? isWardrobe : false);
    const [soldTickets, setSoldTickets]:[any, Function] = useState();
    const titleRef:any = useRef(null);

    const getTickets = ()=>{
        if (readable_event_name){
            fetch(`/api/v1/tickets/${readable_event_name}?reserved=true`)
            .then(async (response)=>{
                setSoldTickets(await response.json());
            })
        }
    }
    
    const steps: TourProps['steps'] = [
        {
          title: 'Upload File',
          description: 'Put your files here.',
          cover: (
            <img
              alt="tour.png"
              src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            />
          ),
          target: () => titleRef.current,
        }
      ];

    const getUsers = ()=>{
        postData("/users-id-name", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response.users){
                setUsers(response.users);
            }
        })
    }

    const getPlaceDatas = (id:string)=>{
        if (id){
            postData(`/venue/${id}`, {token : ParseLocalStorage("long_token")})
            .then((data:any)=>{
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
        postData("/get-companies-in-array", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (!response.error && !response.resposeData){
                let list = [];
                for (let i = 0; i < response.companies.length; i++){
                    list.push({value : response.companies[i]._id, title : response.companies[i].name});
                }
                setCompanyList(list);
            }
        });
        getUsers();
        getTickets();
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


    const prepareMedia = ()=>{
        let sendMedia:any = {};
        let l:any = {...media};
        Object.keys(l).forEach((element:any)=>{
            if (l[element]){
                sendMedia[element] = l[element].replaceAll("&" , "!end!");
                sendMedia[element] = sendMedia[element].replaceAll("=", "!equal!")
                //sendMedia[element] = l[element].replace("}" , "!close!");
                console.log(sendMedia);
            }
        })

        return sendMedia
    }

    const save = ()=>{
        setIsLoading(true);
        let sendData = {
            name : nameOfEvent,
            description : desciption,
            tickets : tickets,
            background : backgroundImage,
            dateOfEvent : dateOfEvent,
            dateOfRelease : dateOfRelease ? dateOfRelease : getNowDate(),
            venue : selectedVenue,
            media : prepareMedia(),
            location : locationOfEvent,
            company : selectedCompany,
            position: position,
            localDiscounts : localDiscounts,
            users : selectedUsers,
            address : address,
            gate_Opening : gateOpening,
            end_Of_The_Event : endOfTheEvent,
            wardrobe : wardrobe
        };

        postData(`/add-event${id ? `/${id}` : ""}`, {data : sendData, token : ParseLocalStorage("long_token")})
        .then(async (data)=>{
            if (data.datas){
                <Error message={(await data.datas).message} />
            }
            else if (data.id && !id){
                window.location.pathname += `/${data.id}`;
            }
            setIsLoading(false);
            setSuccessSave(true);
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

    const valueOfMedia = (text:string, key:"apple_music"|"spotify"|"youtube"|"facebook"|"instagram")=>{
        let l = {...media};
        l[key] = text;
        setMedia(l);
    }

    const changeSelectedUsers = (id:string, status:boolean)=>{
        if (selectedUsers.includes(id) && !status){
            let l = [...selectedUsers];
            const index = l.indexOf(id);
            l.splice(index, 1);
            setSelectedUsers(l);
        }
        else if (status && !selectedUsers.includes(id)){
            let l = [...selectedUsers];
            setSelectedUsers([...l, id]);
        }
    }

    const getUsersInList = (users:Array<string>)=>{
        return users.map((user, index)=>{
            return  (<span style={{color:"white"}}>{user}</span>);
        });
    }

    const summTickets = ()=>{
        let summ = 0;
        if (soldTickets && soldTickets.length){
            soldTickets.forEach((ticket:any) => {
                if (ticket.seats.length){
                    summ+=ticket.seats.length
                }
                else{
                    summ += ticket.numberOfTicket
                }
            });
        }
        return summ
    }

    const occupiedTicket = ()=>{
        let summ = 0;
        if (soldTickets && soldTickets.length){
            soldTickets.forEach((ticket:any) => {
                if (ticket.boughtPlaces.length){
                    summ += ticket.seats.length - ticket.boughtPlaces.length
                }
                else{
                    summ += ticket.numberOfFreeTickets
                }
            });
        }
        return summ
    }


    return (
        <div>
        <BackButton url="/admin/rendezvenyek" className = "create-event-back-button" />
        {contributors ? <div className = "contributors-grid"><div className = "contributors" >
            <span>Szerkesztők: </span>
            
            <AvatarGroup total={contributors.length} max={3} className="avatar-group">
                {
                    contributors.map((contributor)=>{
                        return <StringAvatar width={40} height={40} username={contributor} />
                    })
                }
            </AvatarGroup>
            <Tooltip place="bottom" anchorSelect = ".avatar-group" id="my-tooltip-children-multiline" style={{color:"white"}} >
                {getUsersInList(contributors)}
            </Tooltip>
        </div></div> : ""}
        <div className = "create-Event-Settings-Main">
            <div style={{position : "fixed", bottom : 10, left : 10, zIndex : 999999, width : "35%"}}>
            <Collapse in={successSave}>
        <Alert severity="success"
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={() => {setSuccessSave(false);}}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          Sikeres mentés!
        </Alert>
      </Collapse>
            </div>
            <Statistic title="Jegyek" value={occupiedTicket()} suffix={`/ ${summTickets()}`} />
            <InputText title="Rendezvény címe" onChangeFunction={setNameOfEvent} value = {nameOfEvent} disabled = {isLoading} info={{text : "Ez a cím fog megjelenni az oldalon. Az ajánlott hossza maximum 50 karakter. A rendezvény url-e is ez alapján fog létrejönni."}} />
            <InputText title="Rendezvény helyszíne" onChangeFunction={setLocationOfEvent} value = {locationOfEvent} disabled = {isLoading} info={{text : "Az ide beírt helyszín fog megjelenni az oldalon", image : "/images/info/map.png"}} />
            <InputText title = "Rendezvény helyszínének címe" onChangeFunction={setAddress} value={address} disabled = {isLoading} info={{text : "A rendezvény helyszínének a címe. Írányítószám város, utca házszám. Ez nem fog megjelenítésre kerülni az oldalon, hanem a helyszínre kattintva ennek a címnek a segítségével fogja megkeresni a felhasználó alapértelmezett térképével a helyszínt. Támogatott térképek: Google Maps, Apple Maps. Helyszíneknél megadható a helyszín neve is az utca, házszám helyett, de a térképek ilyenkor nem fogják minden esetben pontosan megtalálni."}} />
            <h4>Esemény helyszíne</h4>
            <h6>Válaszd ki a térképen a marker húzásávál az esemény helyszínét</h6>
            <MarkerMap zoomLevel={14} center={position} title = {locationOfEvent} setPosition={setPostion} />
            <TextArea onChangeFunction={setDescription} title = "Rendezvény leírása" value = {desciption} disabled = {isLoading} />
            <AddNewButton onClick={()=>{reload_All_Selected(); selectedVenue ? setAddWindow(true) : setAddWindow(false)}} />
            <Calendar onChangeFunction={setDateOfEvent} value = {dateOfEvent} title="Rendezvény dátuma" disabled = {isLoading} info={{ text : "Ez a dátum fog megjelenni az oldalon. A megadott dátum a rendezvényt már nem lehet rá vásárolni és eltűnik a főoldalról. A megadott dátumtól számított másfél évvel az oldal gyorsasága érdekében a rendezvény autómatikusan törlésre kerül", image : "/images/info/date.png"}} />
            <Calendar onChangeFunction={setDateOfRelease} value = {dateOfRelease} title="Rendevény megjelenése az oldalon" disabled = {isLoading} info={{text : "A megadott időtől jelenik meg a rendezvény az oldalon és lehet rá jegyet vásárolni. Az értékének kisebbnek kell lennie mint a rendezvény dátuma."}} />
            <Calendar onChangeFunction={setGateOpening} value = {gateOpening} title = "Kapunyitás" disabled= {isLoading} info={{text : "A kapunyitás az oldalon nem kerül mejelenítésre, ez a már megvásárol jegyen lesz látható."}} />
            <Calendar onChangeFunction={setEndOfTheEvent} value={endOfTheEvent} title = "Esemény vége" disabled = {isLoading} info={{text : "Az esemény végére a az Apple pass és a jegy miatt van szükség, ott kerül majd megjelenítésre."}} />
            <Radio.Group onChange={(e:any)=>{setWardrobe(e.target.value)}} defaultValue={wardrobe} className = "event-settings-radio">
                <Radio.Button value={true}>Ruhatár a helyszínen</Radio.Button>
                <Radio.Button value={false}>Nincsenek ruhatár a helyszínen</Radio.Button>
            </Radio.Group>
            <Select title = "Helyszín kiválasztása" options = {venues} onChangeFunction = {changeSelectedVenue} value = {selectedVenue} />
            <Select title = "Vállalt kiválasztása" options = {companyList} onChangeFunction={setSelectedCompany} value={selectedCompany} />
            <Radio.Group onChange={(e:any)=>{setLocalDiscounts(e.target.value)}} defaultValue={localDiscounts} className = "event-settings-radio">
                <Radio.Button value={true}>Helyi kedvezmények</Radio.Button>
                <Radio.Button value={false}>Nincsenek helyi kezvezmények</Radio.Button>
            </Radio.Group>
            <AddMedia media = {media} changeValueOfMedia={valueOfMedia} disabled = {isLoading} />
            <h4>Felhasználók engedélyezése:</h4>
            {users.length ? <UsersList selectedUsers={selectedUsers} userDatas={users} onChangeFunction={changeSelectedUsers} /> : ""}
            <ImageUpload onChangeFunction={(path:string)=>{setBackgroundImage(path)}} file = {{fileName : backgroundImage}} deleteFunction = {()=>{setBackgroundImage("")}} className = "create-event-upload-image" title = "Borítókép feltöltése" />
            {(addWindow || editTicket) && venueDatas ? <AddTicket closeFunction={()=>{setAddWindow(false); setEditTicket(false)}} idOfVenue = {selectedVenue} datasOfVenue = {venueDatas} saveFunction = {addNewTickets} allSelected = {all_Selected} nameOfTicket={editTicket ? editTicket.name : ""} priceOfTicket={editTicket ? editTicket.price : ""} minPriceOfTicket={editTicket ? editTicket.minPrice : ""} maxPriceOfTicket={editTicket ? editTicket.maxPrice : ""} seatsOfTicket={editTicket ? editTicket.seats : ""} id={editTicket ? editTicket.id : ""} editFunction={saveEditedTicket} numberOfTicket={editTicket ? editTicket.numberOfTicket : 0} /> : ""}
            { venueDatas ? <TicketList tickets={tickets} sizeOfArea = {venueDatas.sizeOfArea} sizeOfSeat = {venueDatas.sizeOfSeat} seatDatas = {venueDatas.seatsDatas} deleteFunction = {deleteTicket} editFunction = {edit_Ticket}/> : "" }
            {versions && versions.length ? <TimeLine data = {versions} /> : ""}
            <LoadingButton loading = {isLoading} onClick = {save} style={{margin : "10px auto", display : "block"}} variant="outlined">
                Mentés
            </LoadingButton>
            <Tour open={openTour} onClose={() => setOpenTour(false)} steps={steps} />
        </div>
        </div>
    );
}

export default EventSettings;