import { useState } from "react";
import typeOfReadQrCodeParams from "./types/readQrCodeParams";
import Camera from "../camera/camera.component";
import postData from "../../request/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUpWindow from "../popUpWindow/popUpWindow.component";
import { View, Text, Touchable, Pressable, useColorScheme } from "react-native";
import { Button } from "react-native-ui-lib";
import Response from "./response.component";
import ReadQrCodeStyle from "./style/readQrCodeStyle";
import Theme from "../../theme/defaultSettings";

const ReadQrCode = ({id, backFunction}:typeOfReadQrCodeParams)=>{
    const [opened, setOpened] = useState<boolean>(false); 
    const [eventResponse, setEventResponse] = useState<any>();
    const handleQrCodeReading = async (data:string)=>{
        postData(`ticket-validation/${data}`, {eventId : id, token : await AsyncStorage.getItem("token")}).then((response)=>{
            console.log(response);
            setEventResponse(response);
        });
        setOpened(true);
    };

    return <View>
        <PopUpWindow closeFunction={()=>setOpened(false)} isVisible={opened}>
            <View>
                <Response description={<View><Text style = {{...ReadQrCodeStyle.description, fontFamily : Theme.default.fontFamily, color : useColorScheme() === "dark" ? Theme.dark.color : Theme.light.color}}>{eventResponse ? eventResponse.seatName ? eventResponse.seatName : "" : ""}</Text></View>} type = {eventResponse ? eventResponse.error ? "error" : eventResponse.type : "error"} title = {eventResponse ? eventResponse.message ? eventResponse.message : "" : ""} />
                
            </View>
        </PopUpWindow>
        {opened ? <></> : <Camera closeFunction={backFunction} onReadFunction={handleQrCodeReading} />}</View>
}

export default ReadQrCode;