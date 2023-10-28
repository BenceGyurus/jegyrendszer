import { StyleSheet } from "react-native";
import {Dimensions} from 'react-native';

const ErrorStyle = StyleSheet.create({
    errorBox : {
        backgroundColor : "#ffd0cc",
        width : "80%",
        padding : 20,
        marginLeft : "10%",
        position : "absolute",
        top : 16,
        borderRadius : 8,
        zIndex : 3,
        display : "flex",
        justifyContent : "space-between",
    },
    errorTitle : {
        fontSize : 20,
        color : "#7d7d7d",
        margin: 10
    },
    errorMessage : {
        fontSize : 16,
        color : "#7d7d7d",
        margin: 5
    },
    errorIcon : {
        width : 15,
        height : 15
    },
    errorTitleBox : {
        width : (Dimensions.get("window").width)*0.8-50
    }
})

export default ErrorStyle