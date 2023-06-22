import "../../css/saveButton.css";
type typeOfSaveBUttonParams = {
    onClickFunction : Function
}
const SaveButton = ({onClickFunction}:typeOfSaveBUttonParams)=>{
    return (
        <button className="save-button" onClick={e => onClickFunction()}>Mentés</button>
    );
}

export default SaveButton;