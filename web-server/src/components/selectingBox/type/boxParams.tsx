type typeOfBoxParams = {
    children? : JSX.Element | JSX.Element [],
    boxStyle? : React.CSSProperties,
    boxClassName? : string,
    style? : React.CSSProperties,
    className? : string,
    setArea? : Function,
    boxChildren? : JSX.Element | JSX.Element [],
    width : number,
    height : number,
    endFunction? : Function,
    startFunction? : Function,
    selectingFunction? : Function,
    selecting? : boolean,
    scale? : number,
    scalePos? : {x : number, y : number}
}
export default typeOfBoxParams;