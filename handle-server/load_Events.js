function load_Events(events){
    const Schema = {
        title : String,
        description : String,
        date : String,
        image : save_Image,
        location : Object,
        price : Number,
        readableId : String
    };
    let eventObj = {};
    for (let i = 0; i < Object.keys(events); i++){
        if (Schema[Object.keys(events)[i]]){
            eventObj[Object.keys(events[i])] = Schema[Object.keys(events[i])](events[Object.keys(events[i])]);
        }
    }
}

function save_Image(){
    return "images/tesla.jpeg";
}