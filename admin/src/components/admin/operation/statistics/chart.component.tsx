import typeOfChartParams from "./type/chartParams";
//import { Line } from '@ant-design/plots';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Chart = ({datas, titleY, titleX,}:typeOfChartParams)=>{
    let d = datas.map((data,index)=>{return {"timePeriod" : index+1, "value" : data}});
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
        </LineChart>
    )
};

//<Line viewStyle={{width : 300, height : 200}} data={d} {...config}  />

export default Chart