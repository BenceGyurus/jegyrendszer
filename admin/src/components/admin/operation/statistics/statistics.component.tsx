import { useEffect, useState } from "react";
import postData from "../../../connection/request";
import Error from "../../../notification/error.component";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import typeOfLogs from "./type/logsType";
import { Card, Carousel, Progress, Spin, Statistic } from "antd";
import Meta from "antd/es/card/Meta";
import "../../../../css/statistic.css";
import { ArrowDownOutlined, ArrowUpOutlined, EyeFilled } from "@ant-design/icons";
import Chart from "./chart.component";

const Statistics = ()=>{

    const [error, setError] = useState("");
    const [last24Hours, setLast24Hours] = useState<typeOfLogs>([]);
    const [last24HourVisitors, setLast24HoursVisitors] = useState(0);
    const [yesterDayVisitors, setYesterDayVisitors] = useState(0);
    const [lastOneWeek, setLastOneWeek] = useState<any>([]);

    const getLastOneWeek = async ()=>{
        setLastOneWeek([]);
        for (let i = 7; i > 0; i--){
            let result = await postData(`/all-visitor?fromDate=${new Date(new Date().getTime() - (24 * i * 60 * 60 * 1000))}&toDate=${new Date(new Date().getTime() - (24 * (i - 1) * 60 * 60 * 1000))}`, {token : ParseLocalStorage("long_token")})
            if (!result.error){
                if (!result.totalUniqueTokens) result.totalUniqueTokens = 0;
                setLastOneWeek((prev:any)=>[...prev, result.totalUniqueTokens]);
            }
        }
    }

    const sendRequest = (sendDatas:{fromDate? : string | Date | number, toDate? : string | Date | number, event? : string}, callback?:Function)=>{
        postData(`/logs?fromDate${sendDatas.fromDate ? `=${sendDatas.fromDate}` : ""}&toDate${sendDatas.toDate ? `=${sendDatas.toDate}` : ""}&event${sendDatas.event ? `=${sendDatas.event}` : ""}`, {token : ParseLocalStorage("long_token")})
        .then((response)=>{
            if (!response.error) {if (callback) callback(response)}
            else{
                setError(response.message ? response.message : "Váratlan hiba történt az adatok lekérdezése közben");
            }

        });
    } 

    const getAllVisitors = (sendDatas:{fromDate? : string | Date | number, toDate? : string | Date | number}, callback?:Function)=>{
        postData(`/all-visitor?fromDate${sendDatas.fromDate ? `=${sendDatas.fromDate}` : ""}&toDate${sendDatas.toDate ? `=${sendDatas.toDate}` : ""}`, {token : ParseLocalStorage("long_token")})
        .then((response)=>{
            if (!response.error) {if (callback) callback(response.totalUniqueTokens)}
            else{
                setError(response.message ? response.message : "Váratlan hiba történt az adatok lekérdezése közben");
            }

        });
    };

    useEffect(()=>{
        sendRequest({
            fromDate : new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
            toDate : new Date()
        },
        setLast24Hours);
        getAllVisitors({
            fromDate : new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
            toDate : new Date()
        },
        setLast24HoursVisitors);
        getAllVisitors({
                fromDate : new Date(new Date().getTime() - (48 * 60 * 60 * 1000)),
                toDate : new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
        }, setYesterDayVisitors);
        getLastOneWeek()
    }, []);

    console.log(lastOneWeek);

    const getAllOfLogs = (datas:typeOfLogs)=>{
        let sum = 0;
        datas.forEach(item=>{
            sum += item.number
        });
        return sum;
    }

    const twoColors = { '0%': '#108ee9', '100%': '#87d068' }

    return (<div>
        <Error open = {!!error} setOpen={()=>{setError("")}} message = {error} />
        <div className = "short-stats">
        <Card className = "number-of-visitors short-stat-holder">
        {last24HourVisitors ? <Statistic
          title={<h3>Látogatók ( 24H ):</h3>}
          value={last24HourVisitors}
          valueStyle={{ color: '#3f8600' }}
          suffix = {<p className = {`change-of-the-visitors ${last24HourVisitors/yesterDayVisitors > 1 ? "change-of-the-visitors-up" : "change-of-the-visitors-down"}`}>{yesterDayVisitors < last24HourVisitors ? <ArrowUpOutlined color="green" /> : <ArrowDownOutlined color = "red" />}{`${Math.ceil(last24HourVisitors/yesterDayVisitors*100)}%`}</p>}
        /> : <Spin></Spin>}
      </Card>
        <Card className = "statistics-chart-holder short-stat-holder">
            <h3>Látogatottság: utóbbi 7 nap</h3>
            {lastOneWeek.length ? <Chart datas={lastOneWeek} /> : <></>}
        </Card>
        </div>
        <div className = "statistics-cards-holder">
                {
                last24Hours ? last24Hours.sort((a,b)=>{return a.number > b.number ? -1 : 1}).map(item=>{
                return (<Card className = "statistics-card" cover = {<img className = "event-statistic-cover" src = {`${item.event.background}`} />}>
                        <Meta title = {item.event.name} />
                        <div className = "statistics-holder">
                            <Statistic decimalSeparator = {","} className = {`last-24-statistics ${last24HourVisitors/last24Hours.length*1.1 > item.number && last24HourVisitors/last24Hours.length*.9 < item.number ? "" : last24HourVisitors/last24Hours.length*.9 > item.number ? "last-24-statistics-down" : "last-24-statistics-up" }`} title="Megtekintés" value={item.number} suffix = {<EyeFilled />} />
                            {item.number/last24HourVisitors > 0.4 ? <span className = "statistics-fire"><i className="fas fa-fire" style={{color: "#ff0f0f"}}></i></span> : <></>}
                        </div>
                        {last24HourVisitors != 0 ? <Progress steps={5} percent={Math.ceil((item.number/last24HourVisitors)*100)} strokeColor={twoColors} /> : <Progress type="dashboard" steps={5} percent={0} status="exception" />}
                    </Card>)
                }) : <></>}
        </div>
    </div>)
}


/*
{lastOneWeek.length ?<Chart
            chartType="LineChart"
            width="500px"
            height="400px"
            loader={<Spin></Spin>}
            data={[["Napok","Látogatók száma"],...lastOneWeek.map((number:number, index:number)=>{return [`${index+1}`, number]})]}
            options={{
                curveType: "function",
                areaOpacity: 0,
                legend : false,
                hAxis : {
                    minValue : 0
                },
                vAxis : {
                    minValue : 0
                }
            }}

            /> : <Spin></Spin>}*/

export default Statistics;