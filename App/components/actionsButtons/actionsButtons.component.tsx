import { View, Text, Dimensions, useColorScheme } from "react-native"
import ActionButtonStyle from "./style/actionButtons.style"
import Theme from "../../theme/defaultSettings"

const ActionsButtons = ({actions}:typeOfActionsButtons)=>{
    return (<View style = {{...ActionButtonStyle.boxes}}>
        {
            actions.map(action=>{
                {if (typeof action === "string"){
                    return <View style = {{width : ((Dimensions.get("window").width)*.8)/actions.length, ...ActionButtonStyle.actionButton}}><Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>{action}</Text></View>
                }
                else{
                    return <View>{action}</View>;
                }}
            })
        }
    </View>)
}

export default ActionsButtons