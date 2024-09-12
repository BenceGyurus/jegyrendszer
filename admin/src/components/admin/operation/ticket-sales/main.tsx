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
import Report from "./report.component";
import Notification from "../../../notification/notification.component";
import Error from "../../../notification/error.component";
import "../../../../css/ticket-sales.css";
import Window from "../../../window/window.component";


const { RangePicker } = DatePicker;


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
  const [createReportWindow, setCreateReportWindow] = useState<Boolean>(false);

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
        if (response && !response.error && response.id) window.location.pathname = `/admin/report/${response.id}`; else setError(response.message ? response.message : "Hiba történt a jelentés legenerálása közben.");
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
        <div className = "ticket-sales-search-header">
        <div>
            <Search
              value={searchValue}
              onSearch={(e) => getSales()}
              onChange={(e) => setSearchValue(e.target.value)}
              className="ticket-sales-search-field"
            />
            <div className = "sales-search-filter-container">
              <div className = "sales-search-filter-check-box-container">
                <div>
                  <label htmlFor="local-sales">Helyi eldások</label>
                  <Checkbox id = "local-sales" defaultChecked = {local} checked={local} onChange={e=>{setLocal(e.target.checked)}} />
                </div>
                <div>
                  <label htmlFor="web-sales">Webes eldások</label>
                  <Checkbox id = "web-sales" defaultChecked = {web} checked={web} onChange={e=>{setWeb(e.target.checked)}} />
                </div>
              </div>
            </div>
          </div>
          {createReportWindow ? <Window title="Jelentés készítése" closeFunction={()=>setCreateReportWindow(false)}>
            <div className = "create-report-div">
              <h3>Jelentés készítése</h3>
              <div className = "create-report-containers"><RangePicker id = "create-report-range-picker" defaultValue={[startDate, endDate]} format={dateFormat} onChange={(date:any, dateString)=>{if (date && date.length) {setStartDate(date[0]["$d"]); setEndDate(date[1]["$d"])} else{setStartDate(undefined); setEndDate(undefined)}}} /></div>
              <div className = "create-report-containers">
                <label htmlFor="just-local-checkbox">Csak helyi eladás</label>
                <Checkbox id = "just-local-checkbox" defaultChecked={justLocal} onChange={e=>{setJustLocal(e.target.checked)}}  />
              </div>
              <div className = "create-report-containers">
                <Button onClick={()=>getReport()}>Jelentés készítés</Button>
              </div>
            </div>
          </Window> : <></>}
          <Button onClick={()=>setCreateReportWindow(true)}>Jelentés</Button>
        </div>
        </div>
        {ticketDatas.length && isResponse ? (
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
