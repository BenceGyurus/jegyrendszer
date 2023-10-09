import { v4 as uuid } from 'uuid';
import { Children } from "react";
type groupParamsType = {
    posX : number,
    posY : number,
    id : string,
    children : JSX.Element[] | JSX.Element
}
const Group = ({posX, posY, id, children}:groupParamsType)=>{
    const mappedChildren = Children.map(children, (child:JSX.Element) =>
        (<>{child}</>)
      );
    return (
        <div key = {uuid()}>
            {mappedChildren}
        </div>
    );
}
export default Group;