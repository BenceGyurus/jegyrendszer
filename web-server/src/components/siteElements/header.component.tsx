import "../../css/header.css";

type typeOfMenu = {
    title : string,
    link : string
}

type typeOfHeaderParams = {
    listOfNavMenu? : Array<typeOfMenu> 
}

const Header = ( {listOfNavMenu}:typeOfHeaderParams )=>{

    return (
    <header>
        <div className="header-container">
        <a href="/"><img src="/images/logo.png" alt="agora-logo" className = "logo" /></a>
        </div>
    </header>

    
      
    );
}

/*<img src="/images/logo.png" alt="agora-logo" id = "logo" />*/

export default Header;