import { useState, useEffect } from "react";
import { Radio, Timeline } from 'antd';

type typeOfDatasParams = {
    data : Array<{date : string, username : string}>
}

const createStringToDate = (date:string)=>{
    let objDate = new Date(date);
    return `${objDate.getFullYear()} ${objDate.getMonth() < 10 ? `0${objDate.getMonth()}` : objDate.getMonth()}. ${objDate.getDate() < 10 ? `0${objDate.getDate()}` : objDate.getDate()}. ${objDate.getHours() < 10 ? `0${objDate.getHours()}` : objDate.getHours()}:${objDate.getMinutes() < 10 ? `0${objDate.getMinutes()}` : objDate.getMinutes()}`
}

const TimeLine = ({data}:typeOfDatasParams)=>{
    const generateItemsFromData = ()=>{
        let it:any = [];
        for (let i = 0; i < data.length; i++){
            it.push({label : createStringToDate(data[i].date), children : data[i].username});
        }
        return it
    }

    const [itmes, setItems] = useState();

    useEffect(()=>{
        setItems(generateItemsFromData());
    }, [])

    return (
        <Timeline
        mode="alternate"
        items={itmes}
      />
    );

}

export default TimeLine;