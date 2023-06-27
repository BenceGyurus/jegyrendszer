import "../../css/header.css";
import { v4 as uuid } from 'uuid';

type typeOfMenu = {
    title : string,
    link : string
}

type typeOfHeaderParams = {
    listOfNavMenu? : Array<typeOfMenu> 
}

const header = ( {listOfNavMenu}:typeOfHeaderParams )=>{
    return (

<header>
<div className="header-container">
  <a href="/"><img src="/images/logo.png" alt="agora-logo" className = "logo" /></a>
  <nav>
  <ul className="nav">
              {listOfNavMenu ? listOfNavMenu.map((element:typeOfMenu, index)=>{
                return (
                  <li className="nav-item" key = {uuid()}>
                    <a key = {uuid()} className="nav-link" href={element.link}>{element.title}</a>
                  </li>
                )
            }) : ""}
            </ul>
  </nav>
</div>
</header>

    
      
    );
}

/*<img src="/images/logo.png" alt="agora-logo" id = "logo" />*/

export default header;