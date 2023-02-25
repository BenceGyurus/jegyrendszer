type typeOfSetColorOfSeatComponentParams = {
    color : string,
    size : number
}

const SetColorOfSeatComponent = ( { color , size }:typeOfSetColorOfSeatComponentParams )=>{
    return (
        <div style = {{background : color, width : size, height : size, borderRadius : Math.ceil(size/5)}} className = "exampleSeat">

        </div>
    );
}   

export default SetColorOfSeatComponent