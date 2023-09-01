import { TextInput, Text, View } from "react-native";
import TextInputStyle from "./textinputStyle";
import BasicStyle from "../../defaultStyles/style";
import defaultSettings from "../../defaultSettings";


type typeOfInputTextParams = {
    defaultValue? : string,
    onChangeFunction : Function,
    placeHolder? : string,
    title? : string,
    password? : boolean
}

const InputText = ({defaultValue, onChangeFunction, placeHolder, title, password}:typeOfInputTextParams)=>{
    return (
        title ? (<View>
            <Text style = {{color : defaultSettings.isDark ? BasicStyle.dark.color : BasicStyle.light.color, ...TextInputStyle.title}}>{title}</Text>
            <TextInput value = {defaultValue} onChangeText={text => onChangeFunction(text)} style ={{backgroundColor : defaultSettings.isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor,color : defaultSettings.isDark ? BasicStyle.dark.color : BasicStyle.light.color , ...TextInputStyle.textinput}} keyboardType="default" placeholder={placeHolder} secureTextEntry = {password} />
        </View>) : <TextInput value={defaultValue} onChangeText={text => onChangeFunction(text)} style ={{backgroundColor : defaultSettings.isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor,color : defaultSettings.isDark ? BasicStyle.dark.color : BasicStyle.light.color , ...TextInputStyle.textinput, ...TextInputStyle.shadowProp}} keyboardType="default" placeholder={placeHolder} secureTextEntry = {password} />
    )
}

export default InputText