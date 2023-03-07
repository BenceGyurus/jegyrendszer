import Checkbox from "../../../../checkbox/checkbox.component";
type paramsTypeOfShowAllSeats = {
    showAll : boolean,
    onChangeFunction: any
}

const ShowAllSeats = ({showAll,onChangeFunction}:paramsTypeOfShowAllSeats):any=>{
    return (
        <div>
            <Checkbox onChangeFunction={ onChangeFunction } defaultChecked = {showAll} title = "Összes ülőhely mutatása" />
        </div>
    )
}

export default ShowAllSeats;