import { Dimensions, Image, Text, View } from "react-native"
import defaultSettings from "../../defaultSettings"
import eventStyleCss from "./eventStyle.css"

type typeOfEventParams = {
    title : string,
    image : string,
    id : string
}


const Event = ({title, image, id}:typeOfEventParams)=>{
    return (
        <View>
            <Image source={{uri : `${defaultSettings.url}${image}`}} style = {eventStyleCss.image} />
            <Text>{title}</Text>
        </View>
    )
}

export default Event;