import "../../../../../css/suggestedGroupsPopupwindow.css";
import createAutoGroups from "../createAutomaticallyGroups";
type typeOfSuggestNewGroupsParams = {
    suggestedGroups : Array<Array<string>>,
    seats : Array<any>,
    changeSeatsFunctions:Function,
    addGroupsFunction:Function,
    groups : Array<any>
};
const SuggestNewGroups = ({suggestedGroups, seats, changeSeatsFunctions, addGroupsFunction, groups }:typeOfSuggestNewGroupsParams)=>{
    console.log(suggestedGroups.length);
    return (
        <div className = "popup show">
            <button className="close-button-new-group">x</button>
            <h3>{suggestedGroups.length} új csoport létrehozása ajánlott</h3>
            <input type="button" className = "popup-button" value="Csoportok mutatása" />
            <input type="button" value="Autómatikus létrehozás" className = "popup-button" onClick={e =>{createAutoGroups(suggestedGroups, seats, changeSeatsFunctions, addGroupsFunction, groups)}} />
        </div>
    )
}
export default SuggestNewGroups;