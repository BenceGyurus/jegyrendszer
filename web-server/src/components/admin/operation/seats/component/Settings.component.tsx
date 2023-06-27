import SetSizeOfBackground from "./setSizeOfBackground.component";
import SetSizeOfSeats from "./setSizeOfSeats.component";
import ImageUpload from "./uploadImage";
import SetColorOfBackground from "./setColorOfBackground.component";
import SetColorOfSeatComponent from "./seatInSettings.component";
import ChangeColorOfSeats from "./changeColorOfSeats.component";
import "../../../../../css/createNewVenueSettings.css"
import NewGroup from "./newGroup.component";
import WindowHeader from "../../../../window-header/windowHeader.component";
import SettingsButton from "./settingsButton.component";
import Stage from "./stageInSettings.component";
type typesOfSettingsParams = {
    widthOfArea : number,
    heightOfArea : number,
    setWidthOfArea : Function,
    setHeightOfArea : Function,
    setSizeOfSeatsFunction : Function,
    sizeOfSeat : number,
    uploadFile : Function,
    delteImageFunction : Function,
    showSettingsWindow : boolean,
    settingsWindow : Function,
    colorOfBackground:string,
    setColorOfBackground:Function,
    colorOfSeat : string,
    changeColorOfSeats:Function,
    nameOfBackgroundImage: {isImage : boolean, name : string},
    newGroupFunction : Function,
    selectedStage : number,
    setSelectedStage : Function
}
const Settings = ( {widthOfArea, heightOfArea, setWidthOfArea, setHeightOfArea,setSizeOfSeatsFunction, sizeOfSeat, uploadFile, delteImageFunction, showSettingsWindow, settingsWindow, colorOfBackground, setColorOfBackground, colorOfSeat,changeColorOfSeats, nameOfBackgroundImage, newGroupFunction, selectedStage, setSelectedStage}:typesOfSettingsParams )=>{
    return (
        showSettingsWindow ? 
        <div className = "settings opendSettings">
            <WindowHeader title = "Beállítások" closeWindowFunction={settingsWindow}/>
            <div className = "contentOfSettings">
            <h2>Háttér beállítása</h2>
            <h3>Háttér mérete</h3>
            <SetSizeOfBackground width = {widthOfArea} height = {heightOfArea} setWidth = {setWidthOfArea} setHeight = {setHeightOfArea}/>
            <h3>Kép beállítása háttérnek</h3>
            <ImageUpload onChangeEvent = {uploadFile} deleteImageFunction = {delteImageFunction} imageName = {nameOfBackgroundImage}/>
            <h3>Háttérszín beállítása</h3>
            <SetColorOfBackground color = {colorOfBackground} setColor = {setColorOfBackground} />
            <h2>Ülőhelyek beállítása</h2>
            <h3>Ülőhelyek mérete</h3>
            <SetSizeOfSeats onChangeFunction={setSizeOfSeatsFunction} size = {sizeOfSeat}/>
            <h3>Ülőhelyek színe</h3>
            <ChangeColorOfSeats color = {colorOfSeat} setColorFunction = {changeColorOfSeats} />
            <span>Ülőhely kinézete:</span>
            <SetColorOfSeatComponent color = {colorOfSeat} size = {sizeOfSeat}/>
            <h2>Színpad helye</h2>
            <Stage size = {{width : widthOfArea, height : heightOfArea}} backgroundColor={colorOfBackground} selectedStage={selectedStage} setSelectedStage = {setSelectedStage} />
            <h3>Új csoport létrehozása</h3>
            <NewGroup addNewFunction = {newGroupFunction} />
            </div>
        </div>
        :
        <SettingsButton onClickEvent={settingsWindow} className = "settingsButton"/>







    );
}

//

//<div className = "settings-btn"><img src="/images/settings.png" alt="settings-image" onClick={event => settingsWindow()} className = "settingsIcon" /></div>

export default Settings;