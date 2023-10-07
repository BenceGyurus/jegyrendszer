import { StyleSheet } from "react-native";
import Theme from "../../../theme/defaultSettings";


const textInputStyle = StyleSheet.create({
    textInput : {
        margin: Theme.default.input.margin,
        width: "100%",
        borderColor : "transparent",
        borderBottomColor : Theme.default.borderColor,
        borderWidth : Theme.default.borderSize,
        borderRadius : Theme.default.input.borderRadius,
        fontFamily : Theme.default.fontFamily,
        borderTopLeftRadius : Theme.default.input.borderRadiusTop,
        borderTopRightRadius : Theme.default.input.borderRadiusTop
    },
    inputLabel : {
        fontFamily : Theme.default.fontFamily,
        fontSize : Theme.default.input.labelFontSize,
        marginBottom : Theme.default.input.labelMarginBottom
    },
    inputBox : {
        marginVertical : Theme.default.input.boxMarginVertical
    }
});


export default textInputStyle;