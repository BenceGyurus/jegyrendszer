import {
    StyleSheet,
    Text,
  } from 'react-native';

type typeOfTitleParams = {
    text : string,
    isDark? : boolean
}

const titleStyle = StyleSheet.create({
    title : {
        fontSize : 30,
        margin: 3,
        padding : 3,
        fontWeight: "800"
    },
    light_Title : {
        
        color : "#595959"
    },
    dark_Title : {
        color : "#d6d6d6"
    }
})

const Title = ({text, isDark}:typeOfTitleParams)=>{
    return <Text style = {{fontSize : titleStyle.title.fontSize, margin : titleStyle.title.margin, padding : titleStyle.title.padding, color : isDark ? titleStyle.dark_Title.color : titleStyle.light_Title.color, fontWeight : titleStyle.title.fontWeight}}>{text}</Text>
}

export default Title;