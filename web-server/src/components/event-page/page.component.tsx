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
};

type typeOfAmountTicket = {
  id: string;
  numberOfTicket: number;
  places: Array<string>;
  price: number;
  name: string;
  ticketId: string;
  amount: number;
  selected: number;
  pendingPlaces: Array<string>;
  numberOfFreeTickets: number;
  boughtPlaces: Array<string>;
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
  const genereateTicketAmoutWithOutCookie = (tickets:Array<typeOfTicket>)=>{
    let newList: Array<typeOfAmountTicket> = [];
    for (let i = 0; i < tickets.length; i++) {
      newList.push({ ...tickets[i], amount: 0, selected: 0 });
    }
    console.log(newList);
   setTicketsAmount(newList);
  }

  console.log(ticketsAmount);

  const genereateTicketAmout = (
    tickets: Array<typeOfTicket>,
  ) => {
    let objectId = cookies.get('orderId');
    let newList: Array<typeOfAmountTicket> = [];
    if (objectId){
      fetch(`/api/v1/buy-ticket-details/${objectId}`).then(async (response)=>{
        let data = await response.json();
        if (data && !data.error){
          for (let i = 0; i < tickets.length; i++) {
            let amount = data.tickets.find((ticket:any)=>ticket.ticketId==tickets[i].id)?.amount ? data.tickets.find((ticket:any)=>ticket.ticketId==tickets[i].id)?.amount : 0;
            newList.push({ ...tickets[i], amount: amount ? amount : 0, selected: amount ? amount : 0 });
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

  console.log(ticketsAmount);
  const [selectedTickets, setSelectedTickets]: [Array<string>, Function] =
    useState([]);
  const [errorNat, setErrorNat]: [string, Function] = useState("");
  const [selectNotification, setSelectNotification] = useState(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    let objectId = cookies.get('orderId');
    
    fetch(`/api/v1/tickets/${ticketId}?reserved=true${objectId ? `&c=${objectId}` : ""}`).then(
      async (response) => {
        let t = await response.json();
        if (t.length && !t.error) {
          genereateTicketAmout(t);
        }
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

  const incrementAmountOfTickets = (id: String) => {
    let l = [...ticketsAmount];
    for (let i = 0; i < l.length; i++) {
      if (l[i].id === id && l[i].numberOfFreeTickets > l[i].amount) {
        if (!selectNotification && placeDatas.seats?.length)
          setSelectNotification(true);
        l[i].amount++;
      }
    }
    setTicketsAmount(l);
  };

  const decrementAmountOfTickets = (id: string) => {
    let l = [...ticketsAmount];
    let newList: Array<string> = [];
    for (let i = 0; i < l.length; i++) {
      if (l[i].id === id && l[i].amount > 0) {
        l[i].amount--;
        if (l[i].selected > 0) {
          l[i].selected--;
        }
        let deleted = false;
        if (l[i].selected >= l[i].amount) {
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
        lTicketAmount[i].amount > lTicketAmount[i].selected &&
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
      if (ticketsAmount[i].amount > 0) {
        control = true;
        if (
          !ticketsAmount[i].seats.length &&
          ticketsAmount[i].numberOfTicket > 0
        ) {
          sendData.push({
            amount: ticketsAmount[i].amount,
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
          if (selected.length != ticketsAmount[i].amount) {
            error.push("Kérem válassza ki a helyeket");
            handleShakeButtonClick();
            toSelectTickets();
          } else {
            sendData.push({
              amount: ticketsAmount[i].amount,
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
    console.log(element);
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
        <TicketSkeleton />
      )}
      {placeDatas && placeDatas.seats && placeDatas.seats.length ? (
        <Legend />
      ) : (
        ""
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
        ""
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
