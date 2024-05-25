import { useEffect, useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import TypeOfReports from "./types/typeOfReports";
import { Card, Statistic } from "antd";
import typeOfReport from "./types/typeOfReport";



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

const ReportComponent = ()=>{

    const [id, setId] = useState("");
    const [report, setReport] = useState<Array<typeOfReport>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if (window.location.pathname.split("/").length > 3) setId(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]);

        if (id){
            setLoading(true)
            postData(`/get-report/${id}`, {token : ParseLocalStorage("long_token")})
            .then(response=>{
                setLoading(false)
                if (!response.error && response.report){
                    setReport(response.report);
                }
            })
        }

    }, [id]);


    return <div>
        <Card size="small"><Statistic title="Vásárlások" value={formatNumbers(report ? report.length : 0)} loading = {loading} /></Card>
        <Card size="small"><Statistic title = "Összes bevétel" value = {`${formatNumbers(sumIncomes(report))} HUF`} loading={loading} /></Card>
    </div>
}

export default ReportComponent;