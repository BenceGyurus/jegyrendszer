import { StyleSheet } from "react-native";

const EventListStyle = StyleSheet.create({
    eventListCarousel : {
        width : "80%",
        height : "80%"
    },
    eventListView : {
        display : "flex",
        alignContent : "center",
        height : "100%"
    },
    titles : {
        fontSize : 30,
        marginVertical : 15,
        marginHorizontal : 10
    },
    carouselStyle : {
        height : 400
    }
});

export default EventListStyle;