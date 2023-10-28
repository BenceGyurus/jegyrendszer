import { View, Text } from "react-native-ui-lib";
import ErrorStyle from "./style/error.style";
import typeOfError from "./type/errorParams";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'


const Error = ({ title, message, show }:typeOfError)=>{
    return (show ? <View style = {[ErrorStyle.errorBox]}>
        <View>
        <FontAwesomeIcon style={[ErrorStyle.errorIcon]} icon={ faCircleXmark } />
        <View style = {[ErrorStyle.errorTitleBox]}>
        {title ? <Text style = {[ErrorStyle.errorTitle]}>{title}</Text> : <></>}
        {message ? <Text style = {[ErrorStyle.errorMessage]}>{message}</Text> : <></>}
        </View>
        </View>
    </View> : <></>);
}

export default Error;