import { Button } from "react-native"

type typeOFButtonComponentParams = {
    title : string,
    onPressFunction : Function
}

const ButtonComponent = ({title, onPressFunction}:typeOFButtonComponentParams)=>{
    return <Button onPress={e=>onPressFunction()} title = {title} />
}

export default ButtonComponent