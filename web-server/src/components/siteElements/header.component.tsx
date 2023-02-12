import "../../css/header.css";
import Logo from "../logo/logo.component";
const header = ()=>{
    return (
       <header className = "header" id = "header">
        <Logo name = "header" />
       </header> 
    );
}

/*<img src="/images/logo.png" alt="agora-logo" id = "logo" />*/

export default header;