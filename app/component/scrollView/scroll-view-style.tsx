import {View, StyleSheet, Text, Dimensions} from 'react-native';
import HeaderStyle from '../header/headerStyle';


const ScrollViewStyle = StyleSheet.create({
    scrollView : {
        height : "90%",
        width : "100%"
    },
    lightStyle : {
        backgroundColor : "white"
    },
    darkStyle : {
        backgroundColor: "black"
    }
});

//Dimensions.get('screen').height-HeaderStyle.headerDark.height

export default ScrollViewStyle;