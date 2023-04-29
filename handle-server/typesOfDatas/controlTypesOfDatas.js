function ControlDatas(inputDatas, expectedDatas){
    if (inputDatas && typeof inputDatas == "object"){
    for (let i = 0; i < Object.keys(inputDatas).length; i++){
        let control = false;
        for (let j = 0; j < Object.keys(expectedDatas).length; j++){
            console.log( expectedDatas[Object.keys(expectedDatas)[j]] == typeof(inputDatas[Object.keys(inputDatas)[i]]) , expectedDatas[Object.keys(expectedDatas)[j]], typeof(inputDatas[Object.keys(inputDatas)[i]]), inputDatas[Object.keys(inputDatas)[i]]);
            Object.keys(expectedDatas)[j] == Object.keys(inputDatas)[i] && expectedDatas[Object.keys(expectedDatas)[j]] == typeof inputDatas[Object.keys(inputDatas)[i]] ? control = true : false;
        }
        if (!control) return false;
    }
    return true;
    }
    return false;
}

module.exports = ControlDatas;