import "../../css/noEvent.css";

const NoEvent = ()=>{
    return (
        <div className="no-event-container">
    <div className="no-event-logo">Nincs közelgő esemény</div>
    <div className="no-event-message">
      <div className="no-event-graphic">🎫</div>
    </div>
    <div className="no-event-footer">
      <p>Nézd meg az Agora Savaria weboldalát a további információkért: <a href="https://www.agorasavaria.hu">www.agorasavaria.hu</a></p>
    </div>
  </div>
    );
}

export default NoEvent;