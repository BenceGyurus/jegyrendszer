import MainEvent from "./main-event.component"
import BasicStyle from "../../defaultStyles/style"
import { View } from "react-native"

type typeOfEvents = {
    eventData : {
        date : Date,
        name : string,
        description : string,
        background : string
    },
    id : string
  }

type typeOfMainEventListParams = {
    eventDatas : Array<typeOfEvents>,
    isDark? : boolean,
    basicUrl : string,
    onPressFunction : Function

}

const MainEventList = ({eventDatas, isDark, basicUrl, onPressFunction}:typeOfMainEventListParams)=>{
    return (
        <View style = {{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor}}>
            {eventDatas.map((element)=>{
                return <MainEvent title = {element.eventData.name} id = {element.id} image = {element.eventData.background} isDark = {isDark} onPressFunction={onPressFunction} basicUrl={basicUrl} date = {element.eventData.date} />
            })} 
        </View>
    );
}

/**/

export default MainEventList;