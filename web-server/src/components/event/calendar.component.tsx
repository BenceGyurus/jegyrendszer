const Calendar = (params:any)=>{
    return (
        <div className = "event-date">
            <img className = "calendar" src="images/calendar.png" alt="" />
            <span >{params.date}</span>
        </div>
    )
}

export default Calendar;