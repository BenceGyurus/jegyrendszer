import { Text, Image, View, Pressable } from "react-native";
import BasicStyle from "../../defaultStyles/style";
import EventStyle from "./eventStyle";
import LinearGradient from 'react-native-linear-gradient';
import { useState } from "react";


type typeOfMainEventParams = {
    title : string,
    image : string,
    isDark? : boolean,
    onPressFunction? : Function,
    id : string,
    basicUrl : string,
    date : Date
}

const MainEvent = ({title, image, isDark, onPressFunction, id, basicUrl, date}:typeOfMainEventParams)=>{
    const [darkGradient, setDarkGradient] = useState(['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)' ,'rgba(0,0,0,0.7)']);
    const [lightGradient, setLightGradient] = useState(['rgba(255,255,255,0.0)', 'rgba(255,255,255,0.4)' ,'rgba(255,255,255,0.7)'])

    const editTitle = (title:string)=>{
        let maxLength = 24;
        let newTitle = "";
        if (title){
            let length = title.length > maxLength ? maxLength : title.length
            for (let i = 0; i < length; i++){
                newTitle += title[i];
            }
            title.length > maxLength ? newTitle += "..." : "";
        }
        return newTitle
    }

    return (
        <View style = {{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor,...EventStyle.mainContainer}}>
        <Pressable key={id} style = {{backgroundColor:  isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor, ...EventStyle.eventContainer}} onPress={e=>{onPressFunction ? onPressFunction(id) : false}} >
            <View style = {{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor}}>
                <Image style = {EventStyle.eventImage} source = {{uri : `${basicUrl}${image}`}} />
                <LinearGradient colors={isDark ? darkGradient : lightGradient} style={EventStyle.eventGradient} />
                <Text style = {{fontFamily : BasicStyle.style.fontFamily, ...EventStyle.eventTitle, color : isDark ? BasicStyle.dark.color : BasicStyle.light.color}}>{editTitle(title)}</Text>
            </View>
        </Pressable>
        </View>
    )
}

/**/

export default MainEvent;