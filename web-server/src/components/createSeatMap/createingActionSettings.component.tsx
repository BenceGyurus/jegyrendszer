import { height } from "@mui/system";
import InputNumber from "../input/inputNumber.component";
import typeOfCreateigSettingsParams from "./type/creatingSettingsParams";
import typeOfSizeOfSeat from "./type/sizeOfSeat";
import "../../css/creatingActionSettings.css";
import typeOfSpaceBetween from "./type/spaceBetween";
import InputText from "../input/inputText.component";
import { AutoComplete, Card, Input, Select } from "antd";
import groupByCommonWords from "./groupByCommonWords";

const CreateingSettings = ({ sizeOfSeat, spaceBetween, setSizeOfSeat, setSizeOfBetween, nameOfCoulmn, nameOfPosition, nameOfSeat, setNameOfCoulmn, setNameOfPosition, setNameOfSeat, groups, seats }:typeOfCreateigSettingsParams)=>{

    const setWidthOfSeat = (width:number)=>{
        setSizeOfSeat((prev:typeOfSizeOfSeat)=>({height : prev.height, width : Number(width)}));
    }

    const setHeightOfSeat = (height:number)=>{
        setSizeOfSeat((prev:typeOfSizeOfSeat)=>({width : prev.width, height : Number(height)}));
    }

    const setXOfSpaceBetween = (x:number)=>{
        setSizeOfBetween((prev:typeOfSpaceBetween)=>({x : Number(x), y : prev.y}));
    }

    const setYOfSpaceBetween = (y:number)=>{
        setSizeOfBetween((prev:typeOfSpaceBetween)=>({y : Number(y), x : prev.x}));
    }


    return (<div className = "settings-holder">
                <div>
                    <InputNumber size="middle" value={sizeOfSeat.height} title = "Ülőhelyek magassága" sufix="px" onChangeFunction={setHeightOfSeat} />
                    <InputNumber size="middle" value={sizeOfSeat.width} title = "Ülőhelyek szélessége" sufix="px" onChangeFunction={setWidthOfSeat} />
                </div>
                <div>
                    <InputNumber size="middle" value={spaceBetween.x} title = "Ülések melletti hely" sufix = "px" onChangeFunction={setXOfSpaceBetween} />
                    <InputNumber size="middle" value={spaceBetween.y} title = "Ülések alatti hely" sufix = "px" onChangeFunction={setYOfSpaceBetween} />
                </div>
                <div>
                    <div>
                    <AutoComplete
                        style={{ width: 200 }}
                        placeholder="Ülőhely neve (Földszint jobb, Karzat közép)"
                        onChange={e=>setNameOfPosition(e)}
                        value={nameOfPosition}
                        options={Object.keys(groupByCommonWords(groups, seats)).map( (key) =>{return {value : key}})}
                        />
                    </div>
                <div>
                    <span className = "">Sorok száma</span>
                    <Select defaultValue={true} options={[{ value: true, label: 'Római szám' }, { value: false, label: 'Arab szám' }]}/>
                    <InputText value = {nameOfCoulmn} title = "Ülőhely neve" onChangeFunction={setNameOfCoulmn} />
                </div>
                <div>
                    <span>Székek száma</span>
                    <Select defaultValue={true} options={[{ value: true, label: 'Római szám' }, { value: false, label: 'Arab szám' }]} />
                    <InputText value = {nameOfSeat} title = "Ülőhely neve" onChangeFunction={setNameOfSeat} />
                </div>
                    </div>
        </div>);
}

export default CreateingSettings;