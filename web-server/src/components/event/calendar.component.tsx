import "../../css/dateOfTheEvent.css";

const Calendar = (params:any)=>{

    const months = ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Szept", "Nov", "Dec"]

    return (
        <div className = "event-date">
            <span className = "calendar-text calendar-month">{months[new Date(params.date).getMonth()]}</span>
            <span className = "calendar-text calendar-date">{new Date(params.date).getDate()}</span>
        </div>
    )
}

export default Calendar;