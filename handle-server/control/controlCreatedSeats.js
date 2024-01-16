const controlTypeOfSeat = require("../typesOfDatas/seat");

const controlCreatedSeats = (seats)=>{
    if (seats && seats.length){
        let controled = true;
        seats.forEach(group => {
            if (group.sector && group.seats && group.seats.length){
                group.seats.forEach(seatList =>{
                    seatList.forEach(seat=>{
                        if (!Object.keys(seat).includes("name") || typeof seat.name !== "string" || !Object.keys(seat).includes("id") || typeof seat.id !== "string"){controled = false}
                    })
                })
            }else {
                return false;
            }
        });
        return controled;
    }
    else{
        return true;
    }
}
module.exports = controlCreatedSeats;