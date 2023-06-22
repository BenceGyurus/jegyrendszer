import "../../css/addNewButton.css";

type typeOfAddNewButtonParams = {
    onClick : Function
}

const AddNewButton = ({onClick}:typeOfAddNewButtonParams)=>{
    return (
        <input type="button" value="+" className="add-button" onClick = {e=>{onClick()}}/>
    );
}
export default AddNewButton;