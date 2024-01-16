import { useState, useEffect, useRef } from "react";
import InputText from "../../../../input/inputText.component";
import TextArea from "../../../../input/textArea.component";
import "../../../../../css/eventSettings.css";
import AddNewButton from "../../../../buttons/add_New.component";
import AddTicket from "./addTicket.component";
import Select from "../../../../input/select.component";
import postData from "../../../../connection/request";
import ParseLocalStorage from "../../../../../cookies/ParseLocalStorage";
import ImageUpload from "../../../../image-upload/imageUpload.component";
import { v4 as uuid } from 'uuid';
import TicketList from "./ticketList.component";
import Calendar from "../../../../calendar/calendar.component";
import BackButton from "../../../../back/backbutton.component";
import AddMedia from "./add-media.component";
import MarkerMap from "../../../../map/create-marker-map.component";
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
import { Statistic,Button, Modal,Radio,TourProps,FloatButton, Tour  } from 'antd';
import insertCookie from "../../../../../cookies/insertCookie";
import { ExclamationCircleFilled, ExclamationCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Error from "../../../../notification/error.component";
import postDataJson from "../../../../connection/postDataJson";

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
    readable_event_name? : string,
    performerIn? : string,
    isGroupPerformerIn? : boolean
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
const EventSettings = ( { name, description, tickets_, background, dOfEvent, dOfRelease, venue, mediaDatas, location, company, markerPosition, localD, usersList, contributors,addre, open, end, isWardrobe, versions, readable_event_name, performerIn, isGroupPerformerIn}:typeOfEventSettingsParams )=>{
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

    const [openTour, setOpenTour] = useState<boolean>(!ParseLocalStorage("event_Tutorial"));
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
    const [timeLine, setTimeLine]:[boolean, Function] = useState(false);
    const [error, setError]:[string, Function] = useState("");
    const ticketSalesRef = useRef(null);
    const eventTitleRef = useRef(null)
    const eventLocationRef = useRef(null);
    const eventAddressRef = useRef(null);
    const mapRef = useRef(null);
    const desciptionRef = useRef(null);
    const eventDateRef = useRef(null);
    const releaseDateRef = useRef(null);
    const gateOpeningRef = useRef(null);
    const endOfEventRef = useRef(null);
    const wardrobeRef = useRef(null);
    const venueRef = useRef(null);
    const companyRef = useRef(null);
    const localDiscountsRef = useRef(null);
    const usersRef = useRef(null);
    const backgroundRef = useRef(null);
    const ticketsRef = useRef(null);
    const timeLineRef = useRef(null);
    const mediaRef = useRef(null);
    const performerRef = useRef(null);
    const [errorWindow, setErrorWindow] = useState("");
    const [performer, setPerformer] = useState(performerIn ? performerIn : "");
    const [isPerformerGroup, setIsPerformerGroup] = useState(isGroupPerformerIn ? isGroupPerformerIn : false);

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
          title: 'Jegy eladások',
          description: 'A még megvásárolható jegyek és az összes jegyek számát mutatja.',
          target: () => ticketSalesRef.current,
        },
        {
            title: 'Rendezvény címe',
            description: 'Az itt megadaott cím fog megjelenni az oldalon. Az ajánlott hossza maximum 50 karakter. Az esemény url-e ebből fog generálódni.',
            target: () => eventTitleRef.current,
          }
          ,{
            title: 'Rendezvény helyszíne',
            description: 'A megadott helyszín szöveges formában fog megjelenni az oldalon.',
            target: () => eventLocationRef.current,
          },
          {
            title: 'Rendezvény helyszínének címe',
            description: 'A megadott cím nem fog megjelenni az oldalon. A felhasználó eszközének alapértelmezett térképével ezt a címet fogja megadni. A cím formája: irányítószám, helység, utca házszám. Megadható a helyszín neve is, de ez nem minden térkép esetében működik pontosan.',
            target: () => eventAddressRef.current,
          },
          {
            title: 'Térkény',
            description: 'A rendezvény helyszínének megadása térképen. A helyszín kijelölése a marker húzásával lehetséges. Alapértelmezett értéke az AGORA Művelődési és Sportház.',
            target: () => mapRef.current,
          },
          {
            title: 'Rendezvény leírása',
            description: 'Itt adható meg a rendezvény leírása',
            target: () => desciptionRef.current,
          },
          {
            title: 'Esemény időpontja',
            description: 'A megadott időpont (ÉÉÉÉ.HH.NN.HH.MI) megjelenik az oldalon ezen kívül az esmény eddig az időpontig lesz látható a kezdőlapon és a jegyvásárlás is eddig az időpontig lehetséges. A megadott időpont után másfél évvel az oldal gyorsasága érdekében az esemény minden adattal együtt (borítókép, jegyvásárlások, jegyek, esemény) törlődni fog.',
            target: () => eventDateRef.current,
          },
          {
            title: 'Rendezvény megjelenése',
            description: 'A megadott dátum és időpont után fog majd megjelenni az esemény az oldalon és a jegyvásárlás is csak a megdaott dátum után lehetséges. Az értékének minden esetben kisebbnek kell lennie mint a rendezvény időpontjánál.',
            target: () => releaseDateRef.current,
          },
          {
            title: 'Kapunyitás',
            description: 'A kapunyitás időpontja a jegyen lesz majd látható.',
            target: () => gateOpeningRef.current,
          },
          {
            title: 'Esemény vége',
            description: 'Az esemény végé a jegyen lesz megjelenítve, valamit az apple walletben való megjelenéséhez szükséges.',
            target: () => endOfEventRef.current,
          },
          {
            title: 'Ruhatár a helyszínen',
            description: 'A ruhatár a jegyen lesz megjelenítve a következőképpen: A helyszínen ruhatár működik/ A helyszínen ruhatár nem működik',
            target: () => wardrobeRef.current,
          },
          {
            title: 'Helyszín kiválasztása',
            description: 'Az oldalon létrehozott helyszínt lehet hozzárendelni az eseményhez. Jegy létrehozása csak hozzárendelt eseménnyel lehetséges.',
            target: () => venueRef.current,
          },
          {
            title: 'Vállalat kiválasztása',
            description: 'Az eseményhez hozzárendelhető az oldalon létrehozott vállalat.',
            target: () => companyRef.current,
          },
          {
            title: 'Helyi kedvezmények engedélyezése',
            description: 'A jegyirodában történő eladásnál engedélyezve vannak e a kedvezmények. A kedvezmények a helyi kedvezmények meüpontban hozhatóak létre.',
            target: () => localDiscountsRef.current,
          },
          {
            title: 'Média hozzáadáse',
            description: 'Az eseményhez hozzáadhatóak social media oldalak és zene streaming oldalak, mint a Spotify, Apple Music, Facebook, Instagram, Youtube. A média hozzáadása gombra kattintva a feluró ablakon adhatóak meg a linkek. Csak az fog megjelenni az oldalon, amelyik megvan adva.',
            target: () => mediaRef.current,
          },
          {
            title: 'Felhasználók engedélyezése',
            description: 'A kiválasztott felhasználók fogják csak elérni az eseményt az oldalon és jegyet eladni az eseményhez és a az eseményhez kapcsolódó eladásokat is csak az engedélyezett felhasználók fogják látni.',
            target: () => usersRef.current,
          },
          {
            title: 'Esemény borítóképe',
            description: 'Az esemény borítóképét itt lehet feltölteni. A feltölthető kép formátuma .png .jpg/.jpeg. A borítóképen nem ajánlott felirat és qr kód megjelenítése.',
            target: () => backgroundRef.current,
          },
          {
            title: 'Az eseményhez létrehozott jegyek',
            target: () => ticketsRef.current,
          }
      ];

    const getUsers = ()=>{
        postData("/users-id-name", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response.users){
                setUsers(response.users);
            }
            else if (response?.error){
                setError(response.message ? response.message : "Hiba történt a felhasználók letöltése közben.");
            }
        })
    }

    const getPlaceDatas = (id:string)=>{
        if (id){
            fetch(`/api/v1/venue/${id}`)
            .then(async (data:any)=>{
                if (data && !data.error){
                    setVenueDatas((await data.json()).venue);
                }
                else{
                    setError(data?.message ? data.message : "Hiba történt a terem adatainak letöltése közben.");
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
        if (id) setErrorWindow("Az esemény szerkesztése hatással lehet a már megvásárolt jegyekre, további információkért keresse fel a {} oldalt.");
        postData("/get-venues-in-array", {token : ParseLocalStorage("long_token")})
        .then((datas)=>{
            if (datas.datas){
                setVenues(datas.datas);
            }
            else{
                setError(datas?.message ? datas.message : "Hiba történt a helyszín adatainak letöltése közben.")
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
            else{
                setError(response?.message ? response.message : "Hiba történt a cégek letöltése közben.");
            }
        });
        getUsers();
        getTickets();
    }, []);

    const changeSelectedVenue = (d:string)=>{
        console.log(d);
        setSelectedVenue(d === "default" ? "" : d) ;getPlaceDatas(d === "default" ? "" : d);
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
        if (!media.apple_music || media.instagram || media.facebook || media.spotify || media.youtube ) setErrorWindow("Az esemény tartalmán sokat lendíthet egy az eseménnyel kapcsolatos social média oldal csatolása.");
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
            wardrobe : wardrobe,
            performer : performer,
            isGroupPerformer : isPerformerGroup
        };

        console.log(sendData);

        postDataJson(`/add-event${id ? `/${id}` : ""}`, {data : sendData, token : ParseLocalStorage("long_token")})
        .then(async (data)=>{
            if (data.datas){
                //
            }
            else if (data.id && !id){
                window.location.pathname += `/${data.id}`;
            }
            if (!data.error){
                setIsLoading(false);
                setSuccessSave(true);
            }
            else{
                setError(data?.message ? data.message : "Hiba történt a mentés közben.")
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

    const valueOfMedia = (text:string, key:"apple_music"|"spotify"|"youtube"|"facebook"|"instagram")=>{
        let l = {...media};
        l[key] = text;
        setMedia(l);
    }

    const getSizeOfArea = ()=>{
        let maxX = 0;
        let maxY = 0;
        if (venueDatas && venueDatas.seats && venueDatas.seats.length){
            venueDatas.seats.forEach((seat:any, index:number)=>{
                if (index === 0 || seat.x > maxX) maxX = seat.x;
                if (index === 0 || seat.y > maxY) maxY = seat.y;
            });
        }
        return {
            width : maxX,
            height : maxY
        }
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
                    summ+=Number(ticket.seats.length);
                }
                else{
                    summ += Number(ticket.numberOfTicket);
                }
            });
        }
        return summ;
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


    const controlDates = ()=>{
        if (endOfTheEvent && new Date(dateOfEvent) > new Date(endOfTheEvent)) setError("Az eseménynek korábban kell kezdődnie, mint befejeződnie");
    }

    console.log(tickets);

    return (
        <div>
        <BackButton url="/admin/rendezvenyek" className = "create-event-back-button" />
        {contributors ? <div className = "contributors-grid"><div className = "contributors" >
            <span>Szerkesztők: </span>
            
            <AvatarGroup total={contributors.length} max={5} className="avatar-group">
                {
                    contributors.map((contributor)=>{
                        return <StringAvatar width={40} height={40} username={contributor} />
                    })
                }
            </AvatarGroup>
            <Tooltip  place="bottom" anchorSelect = ".avatar-group" id="my-tooltip-children-multiline" style={{color : '#7d7d7d', background : "#525252", borderRadius : 5}} >
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
        <Error title = "Hiba történt" message={error} open = {error !== ""} setOpen={()=>{setError("")}} />
      </Collapse>
            </div>
            <div ref = {ticketSalesRef} className = "event-settings-holder"><Statistic title="Jegyek" value={occupiedTicket()} suffix={`/ ${summTickets()}`} /></div>
            <div ref = {eventTitleRef} className = "event-settings-holder"><InputText maxLength={60} title="Rendezvény címe" onChangeFunction={setNameOfEvent} value = {nameOfEvent} disabled = {isLoading} info={{text : "Ez a cím fog megjelenni az oldalon. Az ajánlott hossza maximum 50 karakter. A rendezvény url-e is ez alapján fog létrejönni."}} /></div>
            <div ref = {eventLocationRef} className = "event-settings-holder"><InputText title="Rendezvény helyszíne" onChangeFunction={setLocationOfEvent} value = {locationOfEvent} disabled = {isLoading} info={{text : "Az ide beírt helyszín fog megjelenni az oldalon", image : "/images/info/map.png"}} /></div>
            <div ref = {eventAddressRef} className = "event-settings-holder"><InputText title = "Rendezvény helyszínének címe" onChangeFunction={setAddress} value={address} disabled = {isLoading} info={{text : "A rendezvény helyszínének a címe. Írányítószám város, utca házszám. Ez nem fog megjelenítésre kerülni az oldalon, hanem a helyszínre kattintva ennek a címnek a segítségével fogja megkeresni a felhasználó alapértelmezett térképével a helyszínt. Támogatott térképek: Google Maps, Apple Maps. Helyszíneknél megadható a helyszín neve is az utca, házszám helyett, de a térképek ilyenkor nem fogják minden esetben pontosan megtalálni."}} /></div>
            <div ref = {mapRef} className = "event-settings-holder"><h4>Esemény helyszíne</h4>
            <h6>Válaszd ki a térképen a marker húzásávál az esemény helyszínét</h6>
            <MarkerMap zoomLevel={14} center={position} title = {locationOfEvent} setPosition={setPostion} />
            </div>
            <div ref = {desciptionRef} className = "event-settings-holder">
            <TextArea onChangeFunction={setDescription} title = "Rendezvény leírása" value = {desciption} disabled = {isLoading} />
            </div>
            <div ref = {performerRef} className = "event-settings-holder">
                <InputText title = "Fellépő neve" onChangeFunction={setPerformer} value = {performer} />
                <Radio.Group value={isPerformerGroup} onChange={e=>setIsPerformerGroup(e.target.value)} defaultValue="a">
                    <Radio.Button value={true}>Csoport</Radio.Button>
                    <Radio.Button value={false}>Személy</Radio.Button>
                </Radio.Group>
            </div>
            <div ref = {eventDateRef} className = "event-settings-holder">
            <Calendar error = {new Date(dateOfEvent) < new Date(dateOfRelease) || new Date(dateOfEvent) > new Date(endOfTheEvent)} onChangeFunction={setDateOfEvent} value = {dateOfEvent} title="Rendezvény dátuma" disabled = {isLoading} info={{ text : "Ez a dátum fog megjelenni az oldalon. A megadott dátum a rendezvényt már nem lehet rá vásárolni és eltűnik a főoldalról. A megadott dátumtól számított másfél évvel az oldal gyorsasága érdekében a rendezvény autómatikusan törlésre kerül", image : "/images/info/date.png"}} />
            </div>
            <div ref = {releaseDateRef} className = "event-settings-holder">
            <Calendar onChangeFunction={setDateOfRelease} value = {dateOfRelease} title="Rendevény megjelenése az oldalon" disabled = {isLoading} info={{text : "A megadott időtől jelenik meg a rendezvény az oldalon és lehet rá jegyet vásárolni. Az értékének kisebbnek kell lennie mint a rendezvény dátuma."}} />
            </div>
            <div ref = {gateOpeningRef} className = "event-settings-holder">
            <Calendar onChangeFunction={setGateOpening} value = {gateOpening} title = "Kapunyitás" disabled= {isLoading} info={{text : "A kapunyitás az oldalon nem kerül mejelenítésre, ez a már megvásárol jegyen lesz látható."}} />
            </div>
            <div ref = {endOfEventRef} className = "event-settings-holder">
            <Calendar onChangeFunction={setEndOfTheEvent} value={endOfTheEvent} title = "Esemény vége" disabled = {isLoading} info={{text : "Az esemény végére a az Apple pass és a jegy miatt van szükség, ott kerül majd megjelenítésre."}} />
            </div>
            <div ref = {wardrobeRef} className = "event-settings-holder">
            <Radio.Group onChange={(e:any)=>{setWardrobe(e.target.value)}} defaultValue={wardrobe} className = "event-settings-radio">
                <Radio.Button value={true}>Ruhatár a helyszínen</Radio.Button>
                <Radio.Button value={false}>Nincsenek ruhatár a helyszínen</Radio.Button>
            </Radio.Group>
            </div>
            <div ref = {venueRef} className = "event-settings-holder">
            <Select title = "Helyszín kiválasztása" options = {venues} onChangeFunction = {changeSelectedVenue} value = {selectedVenue} />
            </div>
            <div ref = {companyRef} className = "event-settings-holder">
            <Select title = "Vállalt kiválasztása" options = {companyList} onChangeFunction={setSelectedCompany} value={selectedCompany} />
            </div>
            <div ref = {localDiscountsRef} className = "event-settings-holder">
            <Radio.Group onChange={(e:any)=>{setLocalDiscounts(e.target.value)}} defaultValue={localDiscounts} className = "event-settings-radio">
                <Radio.Button value={true}>Helyi kedvezmények</Radio.Button>
                <Radio.Button value={false}>Nincsenek helyi kezvezmények</Radio.Button>
            </Radio.Group>
            </div>
            <div ref = {mediaRef} className = "event-settings-holder">
            <AddMedia media = {media} changeValueOfMedia={valueOfMedia} disabled = {isLoading} />
            </div>
            <div ref = {usersRef} className = "event-settings-holder">
            <h4>Felhasználók engedélyezése:</h4>
            {users.length ? <UsersList selectedUsers={selectedUsers} userDatas={users} onChangeFunction={changeSelectedUsers} /> : ""}
            </div>
            <div ref = {backgroundRef} className = "event-settings-holder">
            <ImageUpload onChangeFunction={(path:string)=>{setBackgroundImage(path)}} file = {{fileName : backgroundImage}} deleteFunction = {()=>{setBackgroundImage("")}} className = "create-event-upload-image" title = "Borítókép feltöltése" />
            </div>
            {(addWindow || editTicket) && venueDatas ? <AddTicket closeFunction={()=>{setAddWindow(false); setEditTicket(false)}} idOfVenue = {selectedVenue} datasOfVenue = {venueDatas} saveFunction = {addNewTickets} allSelected = {all_Selected} nameOfTicket={editTicket ? editTicket.name : ""} priceOfTicket={editTicket ? editTicket.price : ""} minPriceOfTicket={editTicket ? editTicket.minPrice : ""} maxPriceOfTicket={editTicket ? editTicket.maxPrice : ""} seatsOfTicket={editTicket ? editTicket.seats : ""} id={editTicket ? editTicket.id : ""} editFunction={saveEditedTicket} numberOfTicket={editTicket ? editTicket.numberOfTicket : 0} /> : ""}
            <div ref = {ticketsRef} className = "event-settings-holder event-settings-tickets">
            { venueDatas ? <TicketList tickets={tickets} sizeOfArea = {getSizeOfArea()} sizeOfSeat = {venueDatas.sizeOfSeat} seatDatas = {venueDatas.seats} deleteFunction = {deleteTicket} editFunction = {edit_Ticket}/> : "" }
            </div>
            {versions ? <div onClick = {e=>setTimeLine(!timeLine)} className = "time-line-collapse">Idővonal <span className = "time-line-open-icon">{ timeLine ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}</span></div> : <></>}
            <Collapse in = {timeLine}>
            {timeLine ? <TimeLine setTimeLine={()=>{setTimeLine(!timeLine)}} timeLine = {timeLine} data = {versions} /> : ""}
            </Collapse>
            <LoadingButton loading = {isLoading} onClick = {save} style={{margin : "10px auto", display : "block"}} variant="outlined">
                Mentés
            </LoadingButton>
            <FloatButton.Group>
            <FloatButton className = "add-button" onClick={e=>{window.scrollTo(0, 0); setOpenTour(true)}} icon = {<QuestionCircleOutlined />} />
            <FloatButton className = "add-button" icon = {<span>+</span>} onClick={()=>{reload_All_Selected(); selectedVenue ? setAddWindow(true) : setErrorWindow("Jegy létrehozása előtt ki kell választani helyszínt!")}} />
            </FloatButton.Group>
            <Tour open={openTour} onClose={() =>{ setOpenTour(false); insertCookie("event_Tutorial", "true")}} onFinish={()=>{insertCookie("event_Tutorial", "true")}} mask={true} steps={steps} />
            {<Modal closable = {false} open = {errorWindow!==""} footer = {<Button onClick={()=>setErrorWindow("")}>OK</Button>}>
                <h2>Oops!</h2>
                <p>{errorWindow}</p>
            </Modal>}
        </div>
        {backgroundImage ? <div className = "event-site-background-image-div"> <img className = "event-site-background-image" src = {backgroundImage} /> <div className = "event-site-background-image-gradient"></div> </div> : <></>}
        </div>
    );
}

export default EventSettings;