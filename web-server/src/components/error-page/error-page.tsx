import "../../css/noVenue.css";
const errorPage = ()=>{
    return (
        <div className="no-venue-container">
            <h1>Az oldal nem található</h1>
            <p>Nem található ilyen oldal a weboldalon</p>
            <ul>
                <li><a href="/">Főoldal</a></li>
            </ul>
    </div>
    )
}

export default errorPage;