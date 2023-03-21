import "../../../../../css/noVenue.css";

const NoVenue = ()=>{
    return (
        <div className="no-venue-container">
            <h1>Page Not Found</h1>
            <p>The page you're looking for doesn't exist on this website.</p>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/admin">Admin</a></li>
                <li><a href="/admin/termek">Termek</a></li>
            </ul>
    </div>
    );
}

export default NoVenue;