import Seat from "./seat.component"
const seatList = ({seats, groups}:any):any=>{
    groups.map((group:any)=>{
        <div>
            {
            seats.map((seat:any)=>{
                if (group.id == seat.group.id){
                    return <Seat name = {seat.name} title = {seat.title} id = {seat.id} posX = {seat.posX} posY = {seat.posY}/> 
                }
            })
            }
        </div>
    })   
}

export default seatList;