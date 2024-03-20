import { Children } from 'react';
import WindowHeader from '../window-header/windowHeader.component';
import "../../css/window.css";
import { useState } from 'react';


type typeOfWindowParams = {
    closeFunction : Function,
    children : any,
    title : string,
    dragabble? : boolean
}

/*
margin: 3px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc( 100% - 26px );*/

const Window = ( { closeFunction, children, title }:typeOfWindowParams )=>{

    const [pos, setPos] = useState<{x : number,y : number}>({x : window.innerWidth*.25, y : window.innerHeight*.7-(window.innerHeight/2)});

    const onDrag = (x:number,y:number)=>{
        console.log(x,y)
        setPos({x : x, y : y});
    };

    return (
        <div className = "window-component" style={{ top : pos.y, left : pos.x }}>
            <WindowHeader closeWindowFunction={closeFunction} title = {title} onDrag={onDrag} />
            <div className="window-content">
            {Children.map(children, (child:any) =>
                <>{child}</>
            )}
            </div>

        </div>)

}

export default Window;