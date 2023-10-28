import {Text, TextInput, View} from 'react-native';
import textInputStyle from './text-input.style';
import { useColorScheme } from 'react-native';
import Theme from '../../../theme/defaultSettings';
import { useState } from 'react';


type typeOfInputTextParams = {
    value? : string,
    onChange : Function,
    styles? : any,
    title? : string,
    size? : "M" | "S" | "L",
    password? : boolean
}


const InputText =  ({value, onChange, styles, title, size, password}:typeOfInputTextParams)=>{

    const [control, setControl] = useState(false);

    const getSize = ()=>{
        if (size){
            return size === "M" ? {padding : Theme.default.input.mediumPadding, fontSize : Theme.default.input.mediumFontSize} : size === "L" ? {padding : Theme.default.input.largePadding, fontSize : Theme.default.input.largeFontSize} : {padding : Theme.default.input.smallPadding, fontSize : Theme.default.input.smallFontSize}
        }
        return {padding : Theme.default.input.mediumPadding, fontSize : Theme.default.input.mediumFontSize};
    }

    return (<View style = {{...textInputStyle.inputBox}}>
        {title ? <Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color, ...textInputStyle.inputLabel}}>{title}</Text> : <></>}
        <TextInput style = {{...textInputStyle.textInput, ...styles, backgroundColor : useColorScheme() === "dark" ? Theme.dark.inputBackground : Theme.light.inputBackground, color : useColorScheme() === "dark" ? Theme.dark.color : Theme.light.color, ...getSize()}} onChange={(text) => onChange(text.nativeEvent.text)} value={value} secureTextEntry={password && !control ? true : false}  />
    </View>)
}

export default InputText;