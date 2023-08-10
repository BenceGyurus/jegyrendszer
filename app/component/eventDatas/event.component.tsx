import { useEffect, useState } from "react";
import postData from "../../requests/post";
import BasicStyle from "../../defaultStyles/style";
import { Button, Image, Pressable, ScrollView, Text, View } from "react-native";
import Loader from "../loader/loader.component";
import getLocalStorage from "../../storage/getStorage";
import eventStyleCss from "./eventStyle.css";
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons/faQrcode'
import QrCode from "../qrcode/scanQrCode.component";
type typeOfEventParams = {
    id : string,
    closeFunction : Function,
    basicUrl : string,
    isDark? : boolean
};

const Event = ({id, closeFunction, basicUrl, isDark}:typeOfEventParams)=>{

    const [eventDatas, setEventDatas]:any = useState();
    const [openCamera, setOpenCamera]:[boolean, Function] = useState(false);
    
    const getEventDatas = ()=>{
        if (id){
            getLocalStorage("long_token")
            .then(long_Token=>{
                if (long_Token){
                    postData(`${basicUrl}/get-event-data/${id}`, {token : long_Token})
                    .then(response=>{
                    console.log(response);
                    if (!response.error){
                    setEventDatas(response);
                    }
                })
            }
            })
            };
    }

    useEffect(()=>{
        getEventDatas()
    }, []);

    return (
        <View>
            <ScrollView >
              {
                eventDatas && !openCamera ? 
                <View>
                     <Image style = {eventStyleCss.eventImageStyle } source = {{uri : `${basicUrl}${eventDatas.background}`}}  />
                     <LinearGradient colors={["black", "rgba(0,0,0,0)"]} style={eventStyleCss.gradient}>
                        <Text style = {eventStyleCss.eventTitle}>{eventDatas.name}</Text>
                    </LinearGradient>
                    <Pressable onPress={(e)=>setOpenCamera(true)} style={eventStyleCss.qrcode_Icon}>
                        <FontAwesomeIcon icon={faQrcode} size = {70} color="black"/>
                    </Pressable>
                </View>
                 : openCamera ? <QrCode /> : <Loader />}
                 <Button title = "Vissza" onPress={e=>closeFunction()} />
            </ScrollView>
        </View>
    )
}

export default Event;