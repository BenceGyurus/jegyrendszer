import { Dimensions, StyleSheet } from "react-native";

const CameraStyle = StyleSheet.create({
    topView : {
        height : (Dimensions.get("window").height - Dimensions.get("window").height > Dimensions.get("window").width ? Dimensions.get("window").width*.9 : Dimensions.get("window").height*.9)/2,
        width : "100%",
        flex : 1
    },
    camera : {
        height : Dimensions.get("window").height > Dimensions.get("window").width ? Dimensions.get("window").width*.9 : Dimensions.get("window").height*.9,
        width : Dimensions.get("window").height > Dimensions.get("window").width ? Dimensions.get("window").width*.9 : Dimensions.get("window").height*.9,
        margin : Dimensions.get("window").height > Dimensions.get("window").width ? Dimensions.get("window").width*.05 : Dimensions.get("window").height*.05,
        borderRadius : 18,
        overflow : "hidden"
    },
    cameraContainerStyle : {
        height : Dimensions.get("window").height,
        width : "100%",
        flex : 1
    },
    torchIconBox : {
        
    },
    torchIcon : {
        
    },
    container : {
        width : "100%",
        height : "100%"
    },
    cameraTitle : {
        fontSize : 20
    },
    button : {
        textAlign : "center",
        padding : 20,
        borderRadius : 10
    },
    title : {
        fontSize : 40,
        textAlign : "center"
    },
});

export default CameraStyle;