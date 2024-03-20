type typeOfSelectDivParams = {
    children : JSX.Element[] | JSX.Element,
    selectFunction : Function,
    className? : string,
    style? : React.CSSProperties,
    onClick? : Function,
    posFromTop? : number,
    posFromLeft? : number,
    select? : boolean
}

export default typeOfSelectDivParams;