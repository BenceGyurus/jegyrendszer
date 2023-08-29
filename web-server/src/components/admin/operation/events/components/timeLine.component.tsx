import { useState, useEffect } from "react";
import { Radio, Timeline } from 'antd';

type typeOfDatasParams = {
    data : Array<{date : string, username : string}>
}


const TimeLine = ({data}:typeOfDatasParams)=>{
    const generateItemsFromData = ()=>{
        let it:any = [];
        for (let i = 0; i < data.length; i++){
            it.push({label : data[i].date, children : data[i].username});
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