import { Children } from 'react';
import WindowHeader from '../window-header/windowHeader.component';
import "../../css/window.css";


type typeOfWindowParams = {
    closeFunction : Function,
    children : any,
    title : string
}

const Window = ( { closeFunction, children, title }:typeOfWindowParams )=>{
    return (
        <div className = "window-component">
            <WindowHeader closeWindowFunction={closeFunction} title = {title} />
            <div className="window-content">
            {Children.map(children, (child:any) =>
                <>{child}</>
            )}
            </div>

        </div>)

}

export default Window;