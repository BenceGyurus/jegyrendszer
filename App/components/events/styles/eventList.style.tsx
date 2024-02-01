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
        marginHorizontal : 10,
        width: "70%"
    },
    carouselStyle : {
        height : 400
    },
    titleView : {
        display : "flex",
        justifyContent : "space-between",
        flexWrap : "wrap",
        flexDirection : "row",
        width : "100%",
        alignContent: "center",
        alignItems : "center"
    },
    refundIcon : {
        width : 32,
        marginVertical: 10,
        marginHorizontal : 15,
    }
});

export default EventListStyle;