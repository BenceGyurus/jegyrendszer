import {StyleSheet} from "react-native";

const HeaderStyle = StyleSheet.create({
    headerLight : {
        backgroundColor : "#fff",
        width : "100%",
        height : 100
    },
    headerDark : {
        backgroundColor : "#333333",
        width : "100%",
        height : 100
    },
    headerLogo : {
        height : 100,
        width : 185,
        position: 'absolute',
        alignSelf: 'center',
    }
});

export default HeaderStyle;