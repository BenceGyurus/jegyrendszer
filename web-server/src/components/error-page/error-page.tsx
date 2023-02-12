import "../../css/fileNotFound.css";
const errorPage = ()=>{
    return (
        <div><h1>404 Error</h1>
            <span>Ilyen oldal nem található</span>
            <a href="/">Vissza a főoldalra</a>
        </div>
    )
}

export default errorPage;