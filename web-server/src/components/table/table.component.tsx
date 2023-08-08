import ColumnHeader from "./column.component";
import "../../css/table.css";
import { useState, useEffect } from "react";

type typeOfTableParams = {
    datas : any,
    columns : any,
    sortFunction : Function,
    reverseFunction : Function,
    onChangeFunction : Function,
    sortedBy : string,
    reverse : boolean,
    selectedId : string,
    selectFunction : Function,
    filter : any
}

const Table = ({datas, columns, sortFunction, reverseFunction, onChangeFunction, sortedBy, reverse, selectedId, selectFunction, filter}:typeOfTableParams)=>{

    const [page, setPage] = useState(1);
    const [numberOnPage, setNumberOnPage] = useState(30);

    const getPages = ()=>{
        let array = [];
        for (let i = 0; i < Math.ceil(datas.length/numberOnPage); i++){
            array.push(i+1);
        }
        return array;
    }

    const getDate = (d:string)=>{
        let date = new Date(d);
        return `${date.getFullYear()} ${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}. ${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}. ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
    }

    return (
        <div>
        <table className = "table">
            <tr className = "table-header-row">
                <th></th>
                {
                columns.map((column:any)=>{
                    return <ColumnHeader data={column} keyFunction={sortFunction} reverseFunction={reverseFunction} onChangeFunction={onChangeFunction} sortedBy={sortedBy} reverse = {reverse} filter = {filter.find((e:any)=>e.key == column.key) ? filter.find((e:any)=>e.key == column.key) : {}} />
                })
                }
                <th>
                </th>
            </tr>
                {
                datas.map((data:any, index:number)=>{
                    if ((page-1)*numberOnPage <= index && (page)*numberOnPage > index){
                        return (<><tr className = "table-data-row">
                            <td className = "print">
                                {data.buyId === selectedId ? <i onClick={e=>{selectFunction("")}} className="fas fa-angle-down"></i> : <i onClick={e=>{selectFunction(data.buyId)}} className="fas fa-angle-right"></i>}
                            </td>    
                            {
                            columns.map((column:any)=>{
                            return (
                                <td className = "table-data">
                                    {column.type && column.type === "boolean" ? data[column.key] ? "Igen" : "Nem" : column.type && column.type == "date" ? getDate(data[column.key]) : data[column.key]}
                                </td>
                        )})
                    }
                    <td className = "print">
                        {data.local ? <i className="fas fa-print"></i> : <i>-</i>}
                    </td>
                    </tr>
                    {data.buyId === selectedId ? <tr className = "table-data-row" aria-colspan={columns.length}>
                    <td colSpan={columns.length+2}>{
                            <table className = "ticket-table">
                                <tr>
                                    <th>Jegy neve</th>
                                    <th>Jegy egységára</th>
                                    <th>Jegy mennyisége</th>
                                    <th>Összesen</th>
                                </tr>
                            {data.tickets.map((ticket:any)=>{
                                return (
                                    <tr>
                                        <td>{ticket.name}</td>
                                        <td>{ticket.unitPrice}Ft</td>
                                        <td>{ticket.amount}db</td>
                                        <td>{ticket.price}Ft</td>
                                    </tr>
                                )
                            })}
                        </table>
                        }</td>
                    </tr> : ""}
                    </>
                    );
                }
                })
            }
        </table>
        
        <div className = "table-pages">
            {
                getPages().map((d:number, index:number)=>{
                    return <span className = {`table-paginator${page == d ? ` table-current-page` : ""}`} onClick={e=>setPage(d)}>{d}</span>
                })
            }
        </div>
        </div>
    )
}

export default Table;