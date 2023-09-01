import InputText from "../../../../input/inputText.component";
import WindowHeader from "../../../../window-header/windowHeader.component";
import "../../../../../css/datasAboutVenue.css";
import InputNumber from "../../../../input/inputNumber.component";
import Checkbox from "../../../../checkbox/checkbox.component";
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
type typeOfVenueDatasParams = {
    nameOfVenue : string,
    seatsStatus:boolean,
    onChangeFunction: Function,
    numberOfPlaces:number,
    changeName:Function
    changeNumberOfPlaces : Function
}
const VenueDatas = ({nameOfVenue, seatsStatus, onChangeFunction, numberOfPlaces, changeName, changeNumberOfPlaces}:typeOfVenueDatasParams)=>{
    return (
        <div className = "datasAboutVenueDiv">
            <WindowHeader title = "Terem Adatok"/>
            <div className = "getDatasDiv">
            <InputText title = "Helyszín neve" onChangeFunction={changeName} value = {nameOfVenue ? nameOfVenue : ""}/>
            <Radio.Group onChange={e=>onChangeFunction(e.target.value)} defaultValue={seatsStatus} className = "type-of-venue-selector">
                <Radio.Button value={false}>Álló</Radio.Button>
                <Radio.Button value={true}>Ülő</Radio.Button>
            </Radio.Group>
            </div>
        </div>
    );
}

export default VenueDatas;