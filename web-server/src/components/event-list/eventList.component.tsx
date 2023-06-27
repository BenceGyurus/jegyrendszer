import Event from "../event/event.component";
import { v4 as uuid } from 'uuid';

const EventList = (events:any)=>{

    const description_Control = (text:string)=>{
        let max_Length_Of_Text = 60;
        let textResult = max_Length_Of_Text < text.length ? "" : text;
        if (max_Length_Of_Text < text.length){
        for (let i = 0; i < max_Length_Of_Text; i++){
            textResult += text[i];
        }
        textResult+="...";
        }
        return textResult;
    }

    return (
        events.events.map((event:any)=>{
            return (
                <Event
                    id = {event.id}
                    imageName = {event.imageName}
                    date = {event.date}
                    description = {description_Control(event.description)}
                    title = {event.title}
                    key = {event.id}
                    />
                )
    })
    );
}

export default EventList;