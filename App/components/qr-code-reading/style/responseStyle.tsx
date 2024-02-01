import { StyleSheet } from "react-native";

const ResponseStyle = StyleSheet.create({
    container : {
        padding: 20,
        justifyContent : "flex-start",
        flexDirection : "column",
        alignItems : "center",
        height : '100%',
    },
    icon : {
        fontSize : 50,
        width : 50,
        height : 50
    },
    warning : {
        color : "#FFC107"
    },
    error : {
        color : "#FF5733"
    },
    success : {
        color : "#228B22"
    },
    title : {
        fontSize : 40,
        margin: 10,
        padding: 10,
        width: "80%",
        fontWeight : "700",
        textAlign: "center"
    }
});

export default ResponseStyle;