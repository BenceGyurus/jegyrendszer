type typeOfZoomParams = {
    children : JSX.Element,
    width : number,
    height : number,
    isZoom? : boolean,
    gotScale? : number,
    handleScale? : Function,
    defaultPos? : {x : number, y : number},
    setPos? : Function
}

export default typeOfZoomParams;