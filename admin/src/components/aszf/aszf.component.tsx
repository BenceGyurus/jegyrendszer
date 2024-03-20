import "../../css/aszf.css";
import { useEffect, useState } from "react";

const Aszf = ()=>{

    const [text, setText] = useState("");


    const parseText = (text:string)=>{
        return text.replaceAll("!equal!", "=");
    }

    useEffect(()=>{
        fetch("/api/v1/aszf")
        .then(async (response:any)=>{
            response = await response.json();
            if (response && !response.error){
                setText(parseText(response.aszf));
            }
        });
    });

    return (
        <div className = "aszf-body">
            <div dangerouslySetInnerHTML={{__html: text}} />
        </div>
    )
}

export default Aszf;