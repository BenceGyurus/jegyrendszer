const create2DMatrixToArray = (matrix)=>{
    let array = [];
    matrix.forEach(list =>{
        list.forEach(item=>{
            array.push(item);
        })
    })
}

const createArrayOfGroups = (seats)=>{
    let groups = [];
        seats.forEach( group => {
            if (group && group.sector){
                groups.push({id : group.sector?.id, name : group.sector?.name});
            }
        });
    console.log(groups);
    return !groups.length ? false : groups;
}

module.exports = createArrayOfGroups;