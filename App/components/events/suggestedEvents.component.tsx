import { View, Text, useColorScheme } from "react-native";
import typeOfSuggestedEventList from "./type/suggestedParams";
import Event from "./event.component";
import EventListStyle from "./styles/eventList.style";
import Theme from "../../theme/defaultSettings";
import { Carousel } from "@ant-design/react-native";



const SuggestedEventList = ({events}:typeOfSuggestedEventList)=>{
    return (
    <View>
        <Text style = {{...EventListStyle.titles, color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color, fontFamily : Theme.default.weightFontFamily}}>Közelgő események</Text>
    <Carousel autoplay infinite style = {{...EventListStyle.carouselStyle}}>
         {
            events.map(event=>{
                return <Event event = {event} />;
            })
        }
    </Carousel>
    </View>)
}

export default SuggestedEventList;