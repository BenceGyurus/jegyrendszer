import { StyleSheet } from "react-native";


const EventStyle = StyleSheet.create({
    eventTitle : {
        fontSize : 20,
        textAlign : "left",
        position: 'absolute',
        left: "10%",
        zIndex: 1,
        top: "80%",
        maxHeight: "20%",
        maxWidth: "90%",
        fontWeight: "bold",
        overflow:"hidden"
    },
    eventImage : {
        width : "90%",
        height : 200,
        borderRadius: 20,
        marginLeft : "auto",
        marginRight : "auto",
        flex: 1,
    },
    eventContainer: {
        flex: 1,
      },
      eventGradient: {
        position: 'absolute',
        top: "40%",
        width: '90%',
        height: '60%',
        left: "5%",
        borderRadius: 20 
      },
      mainContainer : {
        margin: 30
      }
})

export default EventStyle;