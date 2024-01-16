const seatMatrixToArray = (seats)=>{
    let min = {x : false, y : false};
    let seatsArray = [];
    seats.forEach(groups => {
        groups.seats.forEach(seatList=>{
            seatList.forEach(seat=>{
                seat.group = groups.sector.id;
                seatsArray.push(seat);
                if ((!min.x && min.x!==0) || seat.x < min.x) min.x = seat.x;
                if ((!min.y && min.y!==0) || seat.y < min.y) min.y = seat.y;
            });
        })
    });
    seatsArray.forEach(seat=>{
        seat.x -= min.x;
        seat.y -= min.y
    });
    return seatsArray;
}

module.exports = seatMatrixToArray;