import { useEffect, useState } from "react";
import postData from "../../requests/post";
import BasicStyle from "../../defaultStyles/style";
import { Button, Text, View } from "react-native";
type typeOfEventParams = {
    id : string,
    closeFunction : Function,
    basicUrl : string
};

const Event = ({id, closeFunction, basicUrl}:typeOfEventParams)=>{

    const [eventDatas, setEventDatas]:any = useState();
    
    const getEventDatas = ()=>{
        if (id){
            fetch(`/api/v1/${basicUrl}/event/${id}`)
            .then(async (response:any)=>{
                response = await response.json();
                if (!response.error){
                    setEventDatas(response);
                }
            });
        }
    }

    useEffect(()=>{
        getEventDatas()
    }, []);

    return (
        <View>
            {eventDatas ? <Text style = {{color : "white"}}>{eventDatas.title}</Text> : ""}
            <Button title = "Vissza" onPress={e=>closeFunction()} />
        </View>
    )
}

export default Event;