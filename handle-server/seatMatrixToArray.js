const seatMatrixToArray = (seats, stages)=>{
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
    if (stages && stages.length){
        stages.forEach(stage=>{
            if ((!min.x && min.x!==0) || stage.x < min.x) min.x = stage.x;
            if ((!min.y && min.y!==0) || stage.y < min.y) min.y = stage.y;
        });
        stages.forEach(stage=>{
            stage.x -= min.x;
            stage.y -= min.y;
        })
    }
    seatsArray.forEach(seat=>{
        seat.x -= min.x;
        seat.y -= min.y;
    });
    return {seats : seatsArray, stages : stages};
}

module.exports = seatMatrixToArray;