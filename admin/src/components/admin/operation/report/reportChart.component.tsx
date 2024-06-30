import { useEffect, useState } from "react";
import typeOfReportChartParams from "./types/typeOfReportChartParams";
//import { Line } from '@ant-design/plots';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import typeOfReport from "./types/typeOfReport";


const createGroups = (startDate:Date, endDate:Date, data:Array<typeOfReport>, numberOfGroups:number)=>{
    const interval = (endDate.getTime()-startDate.getTime())/(numberOfGroups);
    let groups:Array<Array<typeOfReport>> = Array.from({ length: numberOfGroups }, () => []);
    data.forEach((element) => {
        groups[Math.floor((element.time-startDate.getTime())/interval)].push(element);
    });
    console.log(groups);
    return groups;
};

const sum = (array:any, key:string|number, secondKey?:string)=>{
    let s = 0;
    array.forEach((element:any)=>{
        if (!secondKey)s+=element[key]; else{
            element[key].forEach((e:any)=>{
                s+=e[secondKey];
            })
        }
    })
    return s;
}

const ReportChart = ({data, startDate, endDate, numberOfGroups, objectKey, secondKey}:typeOfReportChartParams)=>{

    const [d, setD] = useState<Array<{timePeriod : number, value : number}>>([]);

    useEffect(()=>{
        let l:any = [];
        createGroups(startDate, endDate, data, numberOfGroups).forEach((group, index)=>{
            l.push({timePeriod : index+1, value : sum(group, objectKey, secondKey)});
        });
        setD(l);
    }, [data]);
    //let d = data.map((data,index)=>{return {"timePeriod" : index+1, "value" : data}});
    const config = {
        padding: 'auto',
        xField: 'timePeriod',
        yField: 'value',
        xAxis: {
          tickCount: 5,
        },
        smooth: true,
      };
      

return (
    <LineChart width={300} height={80} data={d}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot = {false} />
    </LineChart>)
}

export default ReportChart;