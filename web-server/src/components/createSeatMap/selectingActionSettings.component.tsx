import { Input } from "antd";
import InputText from "../input/inputText.component";
import typeOfSelectedSettingsParams from "./type/selectedSettingsParams";

const SelectingSettings = ({value}:typeOfSelectedSettingsParams)=>{
    return (<div>
        <InputText value={value} onChangeFunction={()=>{}} title="Név" />
    </div>);
}

export default SelectingSettings;