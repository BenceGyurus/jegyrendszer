import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import { useEffect, useState } from "react";
import TicketStats from "./tickets.component";
import Loader from "../../../loader/loader.component";
import { Empty, Pagination, Button, Checkbox, Dropdown, DatePicker } from "antd";
import typeOfDatas from "./types/tableData";
import Search from "antd/es/input/Search";
import TicketRedemptionWindow from "./ticket-redemption-window.component";
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import Report from "./report.component";
import Notification from "../../../notification/notification.component";
import Error from "../../../notification/error.component";
const { RangePicker } = DatePicker;



type typeOfTicket = {
  name: string;
  price: number;
  unitPrice: number;
  amount: number;
  ticketId: string;
  places: Array<string>;
  eventId: string;
};

const dateFormat = 'YYYY/MM/DD';

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button>
          Napi jelentés
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button>
          Heti jelentés
        </Button>
      )
    },
    {
      key: '3',
      label: (
        <Button>
          Havi jelentés
        </Button>
      )
    },
    {
      key: '4',
      label: (
        <Button>
          Évi jelentés
        </Button>
      )
    },
  ];

const TicketSalesMain = () => {
  const [ticketDatas, setTicketDatas]: [Array<typeOfDatas>, Function] =
    useState([]);
  const [page, setPage]: [number, Function] = useState(1);
  const [limit, setLimit]: [number, Function] = useState(10);
  const [maxSales, setMaxSales]: [number, Function] = useState(0);
  const [searchValue, setSearchValue]: [string, Function] = useState("");
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const [redemptionWindow, setRedemptionWindow] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>();
  const [local, setLocal] = useState<boolean>(true);
  const [web, setWeb] = useState<boolean>(true);
  const [displayReport, setDisplayReport] = useState<boolean>(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [justLocal, setJustLocal] = useState(false);
  const [error, setError] = useState<string>("");

  const getSales = () => {
    setIsResponse(false);
    postData(
      `/ticket-sales?eventName=test&date=&page=${page}&limit=${limit}&search=${searchValue}&local=${local ? 1 : 0}&web=${web ? 1 : 0}`,
      { token: ParseLocalStorage("long_token") },
    ).then(async (response) => {
      if (response.responseData) {
        response = await response.responseData;
      } else if (!response.error) {
        setTicketDatas(response.sales);
        setMaxSales(response.max);
      }
      setIsResponse(true);
    });
  };


  const getReport=()=>{
    if (endDate && startDate){
    postData(`/create-report?startDate=${startDate}&endDate=${endDate}&justLocal=${justLocal}`, {token : ParseLocalStorage("long_token")})
      .then(response=>{
        console.log(response);
      })
    }else{
      setError("Kérem adjon meg intervallumot a lekérdezéshez");
    }
  };




  useEffect(() => {
    getSales();
  }, [page, limit]);

  return (
    <div>
      <h1>Jegyeladások</h1>
      <div>
      <div>
        <div>
          <Search
            value={searchValue}
            onSearch={(e) => getSales()}
            onChange={(e) => setSearchValue(e.target.value)}
            className="ticket-sales-search-field"
          />
          <div>
            <div>
              <label htmlFor="local-sales">Helyi eldások</label>
              <Checkbox id = "local-sales" defaultChecked = {local} checked={local} onChange={e=>{setLocal(e.target.checked)}} />
            </div>
            <div>
              <label htmlFor="web-sales">Webes eldások</label>
              <Checkbox id = "web-sales" defaultChecked = {web} checked={web} onChange={e=>{setWeb(e.target.checked)}} />
            </div>
            <Button onClick = {()=>getSales()}>Keresés</Button>
          </div>
        </div>
        <div>
          <h3>Jelentés készítése</h3>
          <RangePicker defaultValue={[startDate, endDate]} format={dateFormat} onChange={(date:any, dateString)=>{if (date && date.length) {setStartDate(date[0]["$d"]); setEndDate(date[1]["$d"])} else{setStartDate(undefined); setEndDate(undefined)}}} />
          <br />
          <label htmlFor="just-local-checkbox">Csak helyi eladás</label>
          <Checkbox id = "just-local-checkbox" defaultChecked={justLocal} onChange={e=>{setJustLocal(e.target.checked)}}  />
          <br />
          <Button onClick={()=>getReport()}>Jelentés készítés</Button>
        </div>
        </div>
        {ticketDatas.length ? (
          <TicketStats datas={ticketDatas} />
        ) : isResponse ? (
          <Empty />
        ) : (
          <Loader />
        )}
        {maxSales ? (
          <Pagination
            defaultCurrent={page}
            pageSize={limit}
            total={maxSales}
            onChange={(e) => setPage(e)}
          />
        ) : (
          ""
        )}
        <TicketRedemptionWindow
          socket={socket}
          opened={redemptionWindow}
          closeFunction={() => setRedemptionWindow(false)}
        />
        <Report closeFunction={()=>setDisplayReport(false)} open = {displayReport} />
        <Notification element={<Error title = "Hiba történt" message={error} open={!!error} setOpen={()=>setError("")} />} />
      </div>
    </div>
  );
};

export default TicketSalesMain;
