type typeOfChangeColorOfSeatsParams = {
    color: string,
    setColorFunction : Function
}
const ChangeColorOfSeats = ( { color, setColorFunction }:typeOfChangeColorOfSeatsParams )=>{
    return (
        <div>
            <label htmlFor="colorOfSeat">Ülőhelyek színe:</label>
            <input type="color" name="colorOfSeat" id="colorOfSeat" value = {color} onChange={e => setColorFunction(e.target.value)} />
        </div>
    );
}

export default ChangeColorOfSeats