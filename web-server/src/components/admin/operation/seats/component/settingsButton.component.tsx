import "../../../../../css/settingsButton.css";

type typeOfSettingsButtonParams = {
    onClickEvent : Function,
    className : string
}

const SettingsButton = ({onClickEvent,className}:typeOfSettingsButtonParams)=>{
    return (
        <button className={`settings-button ${className}`} onClick={e => onClickEvent()}>
            <div className="icon">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>
        Beállítások
        </button>
    );
}

export default SettingsButton;