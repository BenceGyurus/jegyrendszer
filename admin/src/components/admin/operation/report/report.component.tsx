import { useEffect, useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import { Alert, Button, Card, Statistic } from "antd";
import typeOfReport from "./types/typeOfReport";
import ReportChart from "./reportChart.component";
import Loader from "../../../loader/loader.component";
import { DownloadOutlined } from "@ant-design/icons";
import postFile from "../../../connection/file";
import "../../../../css/report.css";



const sumIncomes = (reports:Array<typeOfReport>)=>{
    let summ = 0;
    if (reports){   
        reports.forEach(report=>{
            summ+=report.fullPrice;
        });
    }
    return summ;
};

const formatNumbers = (number:number|string)=>{
    let numberStr = number.toString();
    let reversedStr = numberStr.split('').reverse().join('');
    let withDots = reversedStr.replace(/(\d{3})(?=\d)/g, '$1.');
    let finalStr = withDots.split('').reverse().join('');
    return finalStr;
}

const sumNumberOfTickets = (reports:Array<typeOfReport>)=>{
    let numberOfTickets = 0;
    reports.forEach(report=>{
        report.tickets.forEach(ticket=>{
            numberOfTickets += ticket.amount;
        })
    });
    return numberOfTickets;
}

const getDate = (date:Date|undefined)=>{
    console.log(date);
    if (date){
        return `${date.getFullYear()}.${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}  ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
    };
        return "";
};

const ReportComponent = ()=>{

    const [id, setId] = useState("");
    const [report, setReport] = useState<Array<typeOfReport>>([]);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if (window.location.pathname.split("/").length > 3) setId(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]);

        if (id){
            setLoading(true)
            postData(`/get-report/${id}`, {token : ParseLocalStorage("long_token")})
            .then(response=>{
                setLoading(false)
                if (!response.error && response.report){
                    setStartDate(new Date(response.report.startDate));
                    setEndDate(new Date(response.report.endDate));
                    setReport(response.report.report);
                }
            })
        }

    }, [id]);


    const download = ()=>{
        postFile(`/download-report/${id}`, {token : ParseLocalStorage("long_token")})
        .then(response=>{
            console.log(response);
        })
    }


    return <div>
        <div className = "report-download-button-container"><Button icon={<DownloadOutlined />} size={"middle"} onClick = {()=>download()} >Letöltés (.CSV)</Button></div>
        <div className = "report-warn-container"><Alert className = "report-warn" message="Figyelem" description = "Ezek az adatok a jelentés pillanatában lévő adatokat mutatják, nem frissülnek, friss adathoz új jelentés generálása szükséges" type="warning" ></Alert></div>
        <div className = "report-cards-container">
            <Card loading = {loading} className = "report-card-data">
                { report.length ? `${getDate(startDate)} - ${getDate(endDate)}` :  ""}
            </Card>
            <Card className = "report-card-data" size="small"><Statistic title="Vásárlások" value={formatNumbers(report ? report.length : 0)} loading = {loading} /></Card>
            <Card className = "report-card-data" size="small">
                <Statistic title = "Összes bevétel" value = {`${formatNumbers(sumIncomes(report))} HUF`} loading={loading} />
                {startDate && report && endDate ? <ReportChart objectKey = "fullPrice" numberOfGroups={20} endDate={endDate} data={report} startDate={startDate} /> : <Loader />}
            </Card>
            <Card className = "report-card-data" size="small">
                <Statistic title = "Eladott jegyek száma" value = {`${formatNumbers(sumNumberOfTickets(report))} db`} loading={loading} />
                {startDate && report && endDate ? <ReportChart objectKey = "tickets" secondKey="amount" numberOfGroups={20} endDate={endDate} data={report} startDate={startDate} /> : <Loader />}
            </Card>
        </div>
    </div>
}

export default ReportComponent;