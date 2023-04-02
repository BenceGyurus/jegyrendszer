import "../../css/footer.css";
const footer = ()=>{
    return (
<footer>
<div className="footer-container">
  <div className="row">
    <div className="col-md-6">
      <h3>Kapcsolat</h3>
      <ul className="list-unstyled">
        <li>9700, Szombathely Március 15 Tér 5.</li>
        <li><a href="tel:063694312666">Telefon</a></li>
        <li><a href="mailto:info@agora-savaria.hu">info@agora-savaria.hu</a></li>
        <li><a href="http://agorasavaria.hu">agorasavaria.hu</a></li>
      </ul>
    </div>
    <div className="col-md-6">
      <h3>Közösségi média</h3>
      <ul>
        <li><a href="https://www.facebook.com/agora.savaria">Facebook</a></li>
      </ul>
    </div>
    <div className="col-md-6">
      <h3>Fejlesztőknek</h3>
      <ul className="list-unstyled">
        <li><a href="#">API Documentation</a></li>
        <li><a href="#">Bug Tracker</a></li>
      </ul>
    </div>
  </div>
</div>
<div className="footer-bottom">
  <p id = "copyright">Copyright © 2013-2023 Agora Savaria</p>
  </div>
</footer>


    );
}

export default footer;