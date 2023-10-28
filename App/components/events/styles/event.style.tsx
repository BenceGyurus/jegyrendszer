import { StyleSheet } from "react-native";

const EventStyle = StyleSheet.create({
    eventImage : {
        width: "100%",
        height: 200
    },
    eventCard : {
        margin: 20,
        paddingBottom: 20,
        borderRadius: 15,
        overflow : "hidden",
        borderWidth : .2,
        borderColor : "#828282"
    },
    eventCardTitle : {
        margin: 20,
        textAlign : "center",
        fontSize: 18
    }
})

export default EventStyle;