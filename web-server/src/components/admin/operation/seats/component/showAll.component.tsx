import Checkbox from "../../../../checkbox/checkbox.component";
import { Radio } from 'antd';

type paramsTypeOfShowAllSeats = {
    showAll : boolean,
    onChangeFunction: any
}

const ShowAllSeats = ({showAll,onChangeFunction}:paramsTypeOfShowAllSeats):any=>{
    return (
        <div style = {{width : "max-content", margin : "10px auto"}}>
            <Radio.Group onChange={e=>onChangeFunction(e.target.value)} defaultValue={showAll} style={{ marginTop: 16 }}>
                <Radio.Button value={false}>Kijelölt csoport</Radio.Button>
                <Radio.Button value={true}>Összes hely</Radio.Button>
            </Radio.Group>
        </div>
    )
}

export default ShowAllSeats;