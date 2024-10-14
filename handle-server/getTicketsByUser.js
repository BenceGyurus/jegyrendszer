const Sales = require("./get-sales");
const GetUserDatas = require("./getUserDatas")

const getTicketsBuyUser = async (token)=>{
    console.log(token)
    let userData = await GetUserDatas(token);
    console.log(userData);
    if (userData) return (await Sales(String(userData._id), userData.externalSeller, pagination = false)).sales;
    else return false;
}

module.exports = getTicketsBuyUser;