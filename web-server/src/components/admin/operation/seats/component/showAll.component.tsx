import Checkbox from "../../../../checkbox/checkbox.component";
type paramsTypeOfShowAllSeats = {
    showAll : boolean,
    onChangeFunction: any
}

const ShowAllSeats = ({showAll,onChangeFunction}:paramsTypeOfShowAllSeats):any=>{
    return (
        <div>
            <label htmlFor="showAll">Összes ülőhely mutatása</label>
            <Checkbox onChangeFunction={ onChangeFunction } defaultChecked = {showAll} />
        </div>
    )
}

export default ShowAllSeats;