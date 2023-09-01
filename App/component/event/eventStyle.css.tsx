import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create(
    {
        image : {
            width : "80%",
            height : Dimensions.get("window").height*0.8,
            position : "absolute",
            top : Dimensions.get("window").height*0.1,
            left : "10%",
            borderRadius : 20
        }
    }
)