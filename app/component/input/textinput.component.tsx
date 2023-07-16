import { TextInput, Text, View } from "react-native";
import TextInputStyle from "./textinputStyle";
import BasicStyle from "../../defaultStyles/style";

type typeOfInputTextParams = {
    defaultValue? : string,
    onChangeFunction : Function,
    placeHolder? : string,
    title? : string,
    password? : boolean,
    isDark? : boolean
}

const InputText = ({defaultValue, onChangeFunction, placeHolder, title, isDark, password}:typeOfInputTextParams)=>{
    return (
        title ? (<View>
            <Text style = {{color : isDark ? BasicStyle.dark.color : BasicStyle.light.color, ...TextInputStyle.title}}>{title}</Text>
            <TextInput value = {defaultValue} onChangeText={text => onChangeFunction(text)} style ={{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor,color : isDark ? BasicStyle.dark.color : BasicStyle.light.color , ...TextInputStyle.textinput}} keyboardType="default" placeholder={placeHolder} secureTextEntry = {password} />
        </View>) : <TextInput value={defaultValue} onChangeText={text => onChangeFunction(text)} style ={{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor,color : isDark ? BasicStyle.dark.color : BasicStyle.light.color , ...TextInputStyle.textinput, ...TextInputStyle.shadowProp}} keyboardType="default" placeholder={placeHolder} secureTextEntry = {password} />
    )
}

export default InputText