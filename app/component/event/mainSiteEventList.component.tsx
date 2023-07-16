import MainEvent from "./main-event.component"
import BasicStyle from "../../defaultStyles/style"
import { View } from "react-native"

type typeOfEvents = {
    id : string,
    date : Date,
    title : string,
    description : string,
    imageName : string
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
                return <MainEvent title = {element.title} id = {element.id} image = {element.imageName} isDark = {isDark} onPressFunction={onPressFunction} basicUrl={basicUrl} date = {element.date} />
            })} 
        </View>
    );
}

/**/

export default MainEventList;