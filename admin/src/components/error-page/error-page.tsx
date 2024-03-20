import "../../css/noVenue.css";
import { Button, Result } from 'antd';
const errorPage = ()=>{
    return (
        <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={()=>{window.location.pathname="/"}}>Back Home</Button>}
    />
    )
}

/*
<div className="no-venue-container">
            <h1>Az oldal nem található</h1>
            <p>Nem található ilyen oldal a weboldalon</p>
            <ul>
                <li><a href="/">Főoldal</a></li>
            </ul>
    </div>*/

export default errorPage;