import { ScrollView, Text, View, useColorScheme } from "react-native";
import Camera from "../camera/camera.component";
import typeOfRefund from "./type/refundParams";
import { useEffect, useState } from "react";
import PopUpWindow from "../popUpWindow/popUpWindow.component";
import postData from "../../request/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Response from "../qr-code-reading/response.component";
import Theme from "../../theme/defaultSettings";
import Loader from "../loader/loader.component";
import RefundStyle from "./style/refund.style";
import { Button } from "@ant-design/react-native";


const Refund = ({onClose}:typeOfRefund)=>{

    const [readCode, setReadCode] = useState<string>("");
    const [ticketDatas, setTicketDatas] = useState<any>();
    const [error, setError] = useState("");
    const [isDark, setIsDark] = useState(useColorScheme() === "dark");
    const [success, setSuccess] = useState("");
    const [getTicketDataRequest, setGetTicketDataRequest] = useState(false);

    const getTicketInformations = async (id:string)=>{
        let token = await AsyncStorage.getItem("token");
        setGetTicketDataRequest(prev=>true);
        if (token){
            postData(`get-ticket-information/${id}`, {token : token}).then((response)=>{
                console.log(response);
                if (!response.error && response.ticket){
                    setTicketDatas(response.ticket);
                }else{
                    setError(response.message ? response.message : "Hiba történt a lekérdezés közben");
                }
                setGetTicketDataRequest(prev=>false);
            })
        }
    };

    const refund = async ()=>{
        if (ticketDatas){
            let token = await AsyncStorage.getItem("token");
            if (token){
                postData(`ticket-refund/${ticketDatas._id}`, {token : token}).then(response=>{
                    if (response.error){
                        setError(response.message ? response.message : "Hiba történt a visszaváltás során");
                    }else if (!response.error){
                        setReadCode("");
                        setSuccess(response.message);
                        setTicketDatas(false);
                    }
                });
            }
        }
    };

    return <View>
        <PopUpWindow closeFunction={()=>{setReadCode(""); setTicketDatas(false)}}  isVisible = {!!readCode}>
            <ScrollView style = {{height : "auto"}}>
                <View style = {{flex : 1}}>
                    <Text style = {{fontSize : Theme.default.title.fontSize, color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>Jegyinformációk</Text>
                    {
                    ticketDatas ? (<View>
                        <Text style = {[RefundStyle.defaulText, {fontFamily : Theme.default.fontFamily,color : isDark ? Theme.dark.color : Theme.light.color}]}>Esemény neve: <Text style = {[{fontFamily : Theme.default.fontFamily}]}>{ticketDatas.eventName}</Text></Text>
                        <Text style = {[RefundStyle.defaulText, {fontFamily : Theme.default.fontFamily, color : isDark ? Theme.dark.color : Theme.light.color}]}>Jegy neve: {ticketDatas.nameOfTicket}</Text>
                        {ticketDatas.seatName ? <Text style = {[RefundStyle.defaulText ,{fontFamily : Theme.default.fontFamily, color : isDark ? Theme.dark.color : Theme.light.color}]}>Ülőhhely: {ticketDatas.seatName}</Text> : <></>}
                        <Text style = {[RefundStyle.defaulText,{fontFamily : Theme.default.fontFamily,color : isDark ? Theme.dark.color : Theme.light.color}]}>Jegy ára: {ticketDatas.price}Ft</Text>
                        {ticketDatas && !ticketDatas.valid ? <Text style = {[RefundStyle.defaulText, {fontFamily : Theme.default.fontFamily,color : isDark ? Theme.dark.color : Theme.light.color}]}>Visszaváltható: <Text style = {[RefundStyle.defaulText, ticketDatas.valid ? RefundStyle.valid : RefundStyle.inValid, {fontFamily : Theme.default.fontFamily}]}>{!ticketDatas.valid ? "Igen" : "Nem"}</Text></Text> : 
                        <Text style = {[RefundStyle.defaulText, {fontFamily : Theme.default.fontFamily,color : isDark ? Theme.dark.color : Theme.light.color}]}>Aktiválva: <Text style = {[RefundStyle.defaulText, !ticketDatas.valid ? RefundStyle.valid : RefundStyle.inValid, {fontFamily : Theme.default.fontFamily}]}>{ticketDatas.valid ? "Igen" : "Nem"}</Text></Text>}
                    </View>) : getTicketDataRequest ? <Text>No data</Text> : <Loader />
                    }
                    <Button aria-disabled = {ticketDatas && ticketDatas.valid} onPress = {()=>{refund()}} style = {[RefundStyle.buttonStyle,{backgroundColor : isDark ? Theme.dark.background : Theme.light.background, borderColor : Theme.default.borderColor}]} disabled = {!ticketDatas}><Text style = {{color : isDark ? Theme.dark.color : Theme.light.color}}>Visszaváltás</Text></Button>
                </View>
            </ScrollView>
        </PopUpWindow>
        {error ? <PopUpWindow closeFunction={()=>setError("")}  isVisible = {!!error}>
            <ScrollView style = {{height : "auto"}}>
                <Response type="error" title={error} />
                
            </ScrollView>
        </PopUpWindow> : <></>}
        {success ? <PopUpWindow closeFunction={()=>setSuccess("")}  isVisible = {!!success}>
            <ScrollView style = {{height : "auto"}}>
                <Response type="success" title={success} />
                
            </ScrollView>
        </PopUpWindow> : <></>}
        {!readCode && !success && !error ? <Camera title = "Jegy visszaváltás" onReadFunction={(e:string)=>{setReadCode(e); getTicketInformations(e)}} closeFunction={onClose} /> : <></>}
    </View>
}

export default Refund;