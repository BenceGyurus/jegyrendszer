import Calendar from "./calendar.component";
import EventImage from "./image.component";
import Description from "./description.component";
import Title from "./title.component";
import OpenButton from "./openButton.component";
const Event = (params:any)=>{
    console.log(params.animationDelay);
    return (
        <div className = "event-divs"  style = {{"animationDelay" : params.animationDelay}}>
            <Calendar date = {params.date}/>
            <EventImage imageName = {params.imageName} id = {params.id} />
            <Title title = {params.title}/>
            <Description description = {params.description}/>
            <OpenButton id = {params.id}/>
        </div>
    );
}

export default Event;