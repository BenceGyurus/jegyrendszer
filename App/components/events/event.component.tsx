import typeOfEventParams from "./type/eventParams";
import { View, useColorScheme, Text, Image } from "react-native";
import Server from "../../server/server";
import EventStyle from "./styles/event.style";
import Theme from "../../theme/defaultSettings";
import ActionsButtons from "../actionsButtons/actionsButtons.component";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons/faQrcode'


const Event = ({ event }:typeOfEventParams)=>{
    return <View style = {{backgroundColor : useColorScheme()==="dark" ? Theme.dark.background : Theme.light.background, ...EventStyle.eventCard}}>
            <Image
                style={[EventStyle.eventImage]}
                source={{uri: `http://${Server().url}${Server().api}${event.imageName}`}}
            />
            <Text style = {{...EventStyle.eventCardTitle, color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>{event.title}</Text>
            <ActionsButtons actions={[<FontAwesomeIcon size={20} icon={ faQrcode } color={useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}/>]} />
    </View>;
}


//<Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}} onPress={()=>{}}>QR kód beolvasása</Text>

/*
<Card enableShadow = {false} >
        <Card.Section
            content={[{text: event.title, color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}]}
            contentStyle={{alignItems: 'center'}}
            style = {{...EventStyle.eventCardTitle}}
        />
        <ActionsButtons actions={[]} />
    </Card>*/
export default Event;