const otherData = require("./deitals.js");
class Topology{
    static newUserDatas(userJson){
        return { username : userJson.username, id : userJson._id, readableUsername : userJson.readable_user_id, access : userJson.access};
    }
    static async longTokenData(token, userData, req, lastToken){
        return {token : token, userData : userData ,datas : await otherData(req, lastToken), status : true};
    }
}
module.exports = Topology;