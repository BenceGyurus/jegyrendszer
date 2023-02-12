import "../../css/footer.css";
const footer = ()=>{
    return (
        <footer id = "footer" className = "footer">
            <div id = "footer-container">
                <a href="http://agorasavaria.hu">
                    agorasavaria.hu
                </a>
                •
                <a href="mailto:info@agora-savaria.hu">
                    info@agora-savaria.hu
                </a>
                •
                <a href="https://www.facebook.com/agora.savaria">
                    Facbook
                </a>
                •
                <a href="https://www.youtube.com/mychannel">
                    Youtube
                </a>
                •
                <a href="tel:063694312666">
                    Telefon
                </a>
                •
                <a href="/">
                    ÁSZF
                </a>
            </div>
            <p id = "copyright">Copyright © 2013-2023 Agora Savaria</p>
        </footer>
    );
}

export default footer;