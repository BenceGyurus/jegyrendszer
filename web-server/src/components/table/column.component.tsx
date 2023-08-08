import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
type typeOfColumnParams = {
    data:any,
    keyFunction : Function,
    reverseFunction : Function,
    onChangeFunction : Function,
    sortedBy : string,
    reverse : boolean,
    filter:any
}

const ColumnHeader = ({data, keyFunction, reverseFunction, onChangeFunction, sortedBy, reverse, filter}:typeOfColumnParams)=>{

    console.log(filter.from);

    return (
        <th className = "table-header">
            <span className = {sortedBy == data.key ? "" : "not-displayed-i"} onClick={(e)=>{keyFunction(data.key)}}>{data.title}</span>
            {sortedBy == data.key ? <span onClick = {e=>reverseFunction(data.key)}>{reverse ? <i className="fas fa-sort-amount-up"></i> : <i className="fas fa-sort-amount-down-alt"></i>}</span> : ""}
            {data.type == "date" ? <div className = "select-calendar-div"><i className="fas fa-filter"></i><Calendar value={{from : filter.from, to : filter.to}} onChange={d=>onChangeFunction(d, data.key, data.type)} shouldHighlightWeekends /></div> : <input className = "table-filter-field" type="text" placeholder="filter" onChange={e=>{onChangeFunction(e.target.value,data.key, data.type)}} />}
        </th>
    )
}

export default ColumnHeader;