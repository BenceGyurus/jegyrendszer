import { useState } from "react";
import ShareButton from "./shareButton.component";


const Share = ()=>{

    const [open, setOpen] = useState(false);

    return (
        <div>
        {
            !open ? <ShareButton onClickFunction={()=>{setOpen(true)}} /> : ""
            
        }
        </div>
    )
}

export default Share;