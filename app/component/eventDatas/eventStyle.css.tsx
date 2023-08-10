import {  Dimensions,StyleSheet } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default StyleSheet.create({
    eventImageStyle : {
        width: "100%",
        height : Dimensions.get("window").height
    },
    eventTitle : {
        fontSize : RFPercentage(10),
        color: "white",
        position:"absolute",
        fontWeight : "bold",
    },
    gradient : {
        width: "100%",
        height : (Dimensions.get("window").height-150)/2,
        position: "absolute"
    },
    qrcode_Icon : {
        padding: 10,
        borderRadius: 10,
        position : "absolute",
        top: Dimensions.get("window").height-200,
        right : 15,
        backgroundColor : "white",
        shadowOffset: {width : 1, height : 1},
        shadowOpacity : 1,
        shadowRadius : 2,
        shadowColor : "rgba(0,0,0,0.1)"
    }
})