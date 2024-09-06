import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import "../../css/buy-ticket-page.css";
import postDataJson from "../connection/postDataJson";
import Error from "../notification/error.component";
import BuyButton from "./buy-button.component";
import Legend from "./legend.component";
import TicketPageItems from "./page-items";
import Seats from "./seats.component";
import TicketSkeleton from "./ticket-skeleton.component";
import Tickets from "./tickets.component";
import Cookies from 'universal-cookie';
import Schema from "./schema";
import TypeOfTicketType from "./types/TypeOfTicketType";

type typeOfTicket = {
  id: string;
  numberOfTicket: number;
  places: Array<string>;
  price: number;
  name: string;
  ticketId: string;
  pendingPlaces: Array<string>;
  numberOfFreeTickets: number;
  boughtPlaces: Array<string>;
  types : Array<TypeOfTicketType>;
  selected? : number
};

type typeOfAmountTicketType ={
  id : string,
  amount : number,
  price : number,
  seats : Array<string>
}

type typeOfAmountTicket = {
  id: string;
  numberOfTicket: number;
  places: Array<string>;
  price: number;
  name: string;
  ticketId: string;
  pendingPlaces: Array<string>;
  numberOfFreeTickets: number;
  boughtPlaces: Array<string>;
  types? : Array<typeOfAmountTicketType>,
  amount : number,
  selected: number
};

type typeOfPageParams = {
  title: string;
  background: string;
  description: string;
  date: string;
  id: string;
  placeDatas: typeOfPlaces;
  media: typeOfMedia;
  location: string;
  position: typeOfCenter;
  address: string;
  ticketId: string;
  venueId: string;
  performer : string,
  isGroup : boolean,
  endDate : string
};
type typeOfAmount = {
  id: string;
  amount: number;
};

type typeOfSeat = {
  group: string;
  id: string;
  name: string;
  posX: number;
  posY: number;
  title: string;
};
type typeOfMedia = {
  apple_music?: string;
  spotify?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
};

type typeOfPlaces = {
  background: { isImage: boolean; name: "string" };
  colorOfBackground: string;
  colorOfSeat: string;
  seats: Array<typeOfSeat>;
  sizeOfArea: { width: number; height: number };
  sizeOfSeat: number;
  stage: number;
};
type typeOfCenter = {
  lat: number;
  lng: number;
};

const sumAmountOfAllTypes = (types:Array<typeOfAmountTicketType>)=>{
  let sum = 0;
  types.forEach(type=>{
    sum += type.amount;
  });
  return sum
};

const Page = ({
  title,
  background,
  description,
  date,
  id,
  media,
  position,
  location,
  address,
  ticketId,
  venueId,
  performer,
  isGroup,
  endDate
}: typeOfPageParams) => {

  const [cookies, setCookiesFunction] = useState(new Cookies(null, { path: window.location.pathname }));
  const [ticketsAmount, setTicketsAmount]: [Array<any>, Function] = useState(
    [],
  );
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);
  const genereateTicketAmoutWithOutCookie = (tickets:Array<typeOfTicket>)=>{
    let newList: Array<any> = [];
    for (let i = 0; i < tickets.length; i++) {
      tickets[i].types = tickets[i].types.map((type)=> {return {...type, amount : 0}});
      tickets[i].selected = 0;
      newList.push({ ...tickets[i]});
    }
   setTicketsAmount(newList);
  }

  console.log(ticketsAmount);


  const genereateTicketAmout = (
    tickets: Array<typeOfTicket>,
  ) => {
    let objectId = cookies.get('orderId');
    let newList: Array<any> = [];
    if (objectId){
      fetch(`/api/v1/buy-ticket-details/${objectId}`).then(async (response)=>{
        let data = await response.json();
        if (data && !data.error){
          for (let i = 0; i < tickets.length; i++) {
            //let amount = data.tickets.find((ticket:any)=>ticket.ticketId==tickets[i].id)?.amount ? data.tickets.find((ticket:any)=>ticket.ticketId==tickets[i].id)?.amount : 0;
            tickets[i].types = tickets[i].types.map((type)=> {return {...type, amount : data.tickets.find((ticket:any)=>ticket.ticketId === tickets[i].id)?.types?.find((t:any)=>type.id === t.id)?.amount ? data.tickets.find((ticket:any)=>ticket.ticketId === tickets[i].id)?.types?.find((t:any)=>type.id === t.id)?.amount : 0}});
            tickets[i].selected = 0;
            tickets[i].types.forEach(type=>{
              let typeAmount = data.tickets.find((ticket:any)=>ticket.ticketId === tickets[i].id)?.types?.find((t:any)=>type.id === t.id)?.amount;
              console.log(typeAmount ? typeAmount : 0);
              tickets[i].selected += typeAmount ? typeAmount : 0;
            });
            newList.push({ ...tickets[i]});
          }
          
          setTicketsAmount(newList)
          let l:Array<string> = [];
          data.tickets.forEach((ticket:any)=>{
            l.push(...ticket.places);
          })
          setSelectedTickets(l);
          //setSelectedTickets(ps);
        }
        else{
          genereateTicketAmoutWithOutCookie(tickets);
      }
      }).catch(()=>{
        genereateTicketAmoutWithOutCookie(tickets);
      })
    }else{
      genereateTicketAmoutWithOutCookie(tickets);
    }
  };

  /*
  if (objectId){
      
    }*/
  //const [tickets, setTickets]:[typeOfTicket, Function] = useState();
  const [placeDatas, setPlaceDatas]: [any, Function] = useState([]);

  const [selectedTickets, setSelectedTickets]: [Array<string>, Function] =
    useState([]);
  const [errorNat, setErrorNat]: [string, Function] = useState("");
  const [selectNotification, setSelectNotification] = useState(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    let objectId = cookies.get('orderId');
    setLoadingTickets(true);
    fetch(`/api/v1/tickets/${ticketId}?reserved=true${objectId ? `&c=${objectId}` : ""}`).then(
      async (response) => {
        let t = await response.json();
        if (t.length && !t.error) {
          genereateTicketAmout(t);
        }
        setLoadingTickets(false);
      },
    );
    fetch(`/api/v1/venue/${venueId}?event=${ticketId}`).then(
      async (response) => {
        let venue = await response.json();
        if (!venue.error && venue) {
          setPlaceDatas(venue.venue);
        }
      },
    );
  }, []);


  const incrementAmountOfTickets = (id: string, typeId:string) => {
    let l = [...ticketsAmount];
    for (let i = 0; i < l.length; i++) {
      if (l[i].id === id && sumAmountOfAllTypes(l[i].types) < l[i].numberOfFreeTickets) {
        if (!selectNotification && placeDatas.seats?.length) setSelectNotification(true);
        let thisType = l[i].types.find((k:typeOfAmountTicketType)=>k.id==typeId);
        thisType.amount++;
        l[i].types = [...l[i].types.filter((type:typeOfAmountTicketType)=> type.id != typeId), thisType];
      }
    }
    setTicketsAmount(l);
  };


  const decrementAmountOfTickets = (id: string, typeId: string) => {
    let l = [...ticketsAmount];
    let newList: Array<string> = [];
    for (let i = 0; i < l.length; i++) {
      if (l[i].id === id && sumAmountOfAllTypes(l[i].types) > 0) {
        let thisType = l[i].types.find((k:typeOfAmountTicketType)=>k.id==typeId);
        thisType.amount--;
        l[i].types = [...l[i].types.filter((type:typeOfAmountTicketType)=> type.id != typeId), thisType];
        let deleted = false;
        if (l[i].selected >= sumAmountOfAllTypes(l[i].types)) {
          l[i].selected--;
          let lamdba = [...selectedTickets];
          for (let j = lamdba.length - 1; j >= 0; j--) {
            if (!l[i].seats.includes(lamdba[j]) || deleted) {
              newList.push(lamdba[j]);
            }
            if (l[i].seats.includes(lamdba[j])) {
              deleted = true;
            }
          }
          setSelectedTickets(newList);
        }
      }
    }
    setTicketsAmount(l);
  };

  const selectSeat = (id: string) => {
    setSelectNotification(false);
    setErrorNat("");
    let lTicketAmount = [...ticketsAmount];
    for (let i = 0; i < lTicketAmount.length; i++) {
      if (
        lTicketAmount[i].seats.includes(id) &&
        sumAmountOfAllTypes(lTicketAmount[i].types) > lTicketAmount[i].selected &&
        !selectedTickets.includes(id)
      ) {
        let l = [...selectedTickets, id];
        setSelectedTickets(l);
        lTicketAmount[i].selected++;
      } else if (
        lTicketAmount[i].seats.includes(id) &&
        selectedTickets.includes(id)
      ) {
        if (lTicketAmount[i].selected > 0) {
          lTicketAmount[i].selected--;
        }
        let l = [...selectedTickets];
        let newList: Array<string> = [];
        newList = l.filter((item) => item != id);
        setSelectedTickets(newList);
      }
    }
    setTicketsAmount(lTicketAmount);
  };

  const getTotalAmountOfTickets = () => {
    let fullAmount = 0;
    ticketsAmount.forEach((ticket) => {
      fullAmount += ticket.amount;
    });
    return fullAmount;
  };

  const buy_Ticket = () => {
    let sendData = [];
    let error = [];
    let control = false;
    for (let i = 0; i < ticketsAmount.length; i++) {
      if (sumAmountOfAllTypes(ticketsAmount[i].types) > 0) {
        control = true;
        if (
          !ticketsAmount[i].seats.length &&
          ticketsAmount[i].numberOfTicket > 0
        ) {
          sendData.push({
            types : ticketsAmount[i].types.filter((type:any)=>type.amount),
            amount: sumAmountOfAllTypes(ticketsAmount[i].types),
            ticketId: ticketsAmount[i].id,
            places: false,
            eventId: id,
          });
        } else if (
          ticketsAmount[i].numberOfTicket > 0 &&
          ticketsAmount[i].seats.length
        ) {
          let selected = [];
          for (let j = 0; j < selectedTickets.length; j++) {
            if (ticketsAmount[i].seats.includes(selectedTickets[j])) {
              selected.push(selectedTickets[j]);
            }
          }
          if (selected.length != sumAmountOfAllTypes(ticketsAmount[i].types)) {
            error.push("Kérem válassza ki a helyeket");
            handleShakeButtonClick();
            toSelectTickets();
          } else {
            sendData.push({
              types : ticketsAmount[i].types,
              amount: sumAmountOfAllTypes(ticketsAmount[i].types),
              ticketId: ticketsAmount[i].id,
              places: selected,
              eventId: id,
            });
          }
        }
      }
    }
    if (!control) {
      error.push("Kérem adja meg a vásárolni kívánt mennyiséget!");
    }
    if (!error.length) {
      setIsloading((prev) => true);
      let orderId = cookies.get('orderId');
      postDataJson(`/order-ticket${orderId ? `?c=${orderId}` : ""}`, { datas: sendData, eventId: id }).then(
        async (response) => {
          setIsloading(false);
          if (response.responseData) {
            response = await response.responseData;
            setErrorNat(response.message);
          } else if (!response.error && response.token) {
            cookies.set('orderId', response.token, {expires : response.expires});
            window.location.pathname = `/jegyvasarlas/${response.token}`;
          }
        },
      );
      return;
    }
    if (!error.length) {
      error.push("Hiba történet az oldal betöltése közben");
    }
    setErrorNat(error[0]);
  };

  const toOtherInformations = () => {
    const element: any = document?.getElementById("event-page-description");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  const toSelectTickets = () => {
    //
    const element: any = document?.getElementById("seat-map-canvas-holder");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  const [isShaking, setShaking] = useState(false);

  const handleShakeButtonClick = () => {
    setShaking(true);

    // Reset shaking state after a short delay
    setTimeout(() => {
      setShaking(false);
    }, 500);
  };

  console.log(ticketsAmount);

  return (
    <div className="event-page-div">
      { ticketsAmount ? 
        <Schema title={title} description={description} startDate={date} endDate = {endDate} ticketPrice={ticketsAmount.length ? ticketsAmount[0].price : 0} image={`${window.location.origin}${background}`} performer={performer} isGroup = {isGroup} placeName={location} />
      : <></>}
      <Error
        message={errorNat}
        open={errorNat != ""}
        setOpen={() => setErrorNat("")}
      />
      <TicketPageItems
        title={title}
        image={background}
        description={description}
        date={date}
        media={media}
        position={position}
        location={location}
        address={address}
      />
      {ticketsAmount && ticketsAmount.length ? (
        <Tickets
          tickets={ticketsAmount}
          incrementFunction={incrementAmountOfTickets}
          decrementFunction={decrementAmountOfTickets}
        />
      ) : (
        loadingTickets ? <TicketSkeleton /> : <></>
      )}
      {placeDatas && placeDatas.seats && placeDatas.seats.length ? (
        <Legend />
      ) : (
        <></>
      )}
      {placeDatas &&
      placeDatas.seats &&
      placeDatas.seats.length &&
      ticketsAmount &&
      ticketsAmount.length ? (
        <Seats
          places={placeDatas}
          tickets={ticketsAmount}
          seleted={selectedTickets}
          onClickFunction={selectSeat}
        />
      ) : (
        <></>
      )}
      <div className="alert-notification">
        <Collapse in={selectNotification}>
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSelectNotification(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Válassza ki a helyeket a jegy tükrön!
          </Alert>
        </Collapse>
      </div>
      <BuyButton
        isLoading={isLoading}
        error={!!errorNat}
        shakeButton={isShaking}
        selectTicketsFunction={toSelectTickets}
        isSeats={placeDatas && placeDatas.seats && placeDatas.seats.length}
        otherInformationFunction={toOtherInformations}
        amountOfTickets={ticketsAmount ? getTotalAmountOfTickets() : 0}
        onClickFunction={buy_Ticket}
      />
    </div>
  );
};
export default Page;
