function ControlDatas2(inputDatas, expectedDatas){
    if (inputDatas && typeof inputDatas == "object"){
    for (let i = 0; i < Object.keys(inputDatas).length; i++){
        let control = false;
        for (let j = 0; j < Object.keys(expectedDatas).length; j++){
            Object.keys(expectedDatas)[j] == Object.keys(inputDatas)[i] && expectedDatas[Object.keys(expectedDatas)[j]] == typeof inputDatas[Object.keys(inputDatas)[i]] ? control = true : false;
        }
        if (!control) return false;
    }
    return true;
    }
    return false;
}

const ControlDatas = (inputDatas, expectedDatas)=>{
    let control = true;
    for (let i = 0; i < Object.keys(expectedDatas).length; i++){
        typeof inputDatas[Object.keys(expectedDatas)[i]] == expectedDatas[Object.keys(expectedDatas)[i]] ? true : control = false;
    }
    return control && Object.keys(inputDatas).length == Object.keys(expectedDatas).length;
}

module.exports = ControlDatas;