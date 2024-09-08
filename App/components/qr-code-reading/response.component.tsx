import { Dimensions, Text, View, useColorScheme } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import ResponseStyle from "./style/responseStyle";
import Theme from "../../theme/defaultSettings";

const Response = ({title, type, description}:typeOfResponseParams)=>{

    console.log(title, type, description);

    return (<View style = {{...ResponseStyle.container, backgroundColor : useColorScheme() === "dark" ? Theme.dark.background : Theme.light.background}}>
        <FontAwesomeIcon size={Dimensions.get("window").width*.5} style={{color : type === "error" ? ResponseStyle.error.color : type === "warn" ? ResponseStyle.warning.color : ResponseStyle.success.color, ...ResponseStyle.icon}} icon={type === "error" ? faCircleExclamation : type === "success" ? faCheckCircle : faTriangleExclamation} />
        <Text style = {{color : useColorScheme() === "dark" ? Theme.dark.color : Theme.light.color, backgroundColor : useColorScheme() === "dark" ? Theme.dark.background : Theme.light.background, ...ResponseStyle.title}}>{title}</Text>
        {description}
    </View>);
}
export default Response;