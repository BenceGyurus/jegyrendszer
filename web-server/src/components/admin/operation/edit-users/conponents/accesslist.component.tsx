import Checkbox from "../../../../checkbox/checkbox.component";
import {v4 as uuid} from "uuid"


type typeOfUser = {
    username : string,
    access : Object,
    cantEdit : Boolean,
    id : string
}

type typeOfAccessListParams = {
    userAccess : Array<any>,
    changeFunction : Function
}



const AccessList = ({userAccess, changeFunction}:typeOfAccessListParams)=>{
    return (
    <ul>
        {
            userAccess.map((access:any)=>{
                let id = uuid();
                return  <li className = "user-edit-accesslist" key = {id}><label htmlFor={id}>{access[1]}</label><span className = "user-edit-checkbox-span"><Checkbox id = {id} defaultChecked={access[2]} onChangeFunction={changeFunction} params={[access[0]]}/></span></li>
            })
        }
    </ul>
    );
}

export default AccessList;