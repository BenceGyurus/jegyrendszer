import Draggable from "react-draggable"
import { v4 as uuid } from 'uuid';
import { Children } from "react";
type groupParamsType = {
    posX : number,
    posY : number,
    id : string,
    children : any
}
const Group = ({posX, posY, id, children}:groupParamsType):any=>{
    const mappedChildren = Children.map(children, child =>
        <div>
          {child}
        </div>
      );
    return (
        <div key = {uuid()}>
            {mappedChildren}
        </div>
    );
}
export default Group;