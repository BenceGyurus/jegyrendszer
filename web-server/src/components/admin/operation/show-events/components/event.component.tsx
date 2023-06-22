import "../../../../../css/show-admin-event.css";

type typeOfEventParams = {
    name : string,
    description : string,
    background : string,
    editFunction : Function,
    deleteFunction : Function,
    id : string
}

const Event = ( { name, description, background, editFunction, deleteFunction,id }:typeOfEventParams )=>{
    return (<div className = "event-div">
        <img src={background} alt="borítókép" className = "admin-event-cover-photo" />
        <h2 className = "admin-event-name">{name}</h2>
        <button className="edit-button" onClick = {e=>editFunction(id)}>Szerkesztés</button>
        <button className = "delete-button" onClick = {e=>deleteFunction(id)} >Törlés</button>
    </div>);
}

export default Event;