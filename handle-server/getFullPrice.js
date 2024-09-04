const getTicketByReadableId = require("./getTicketByReadableId");

const getPricesByTypes = (types, typesData)=>{
    let newTypes = [];
    types.forEach(type=>{
        let typeData = typesData.find(l=>type.id==l.id);
        if (typeData) newTypes.push({...type, price : type.amount*typeData.price, unitPrice : typeData.price});
    });
    return newTypes;
}

const getPriceOfTypes = (types, allTypes)=>{
    let price = 0;
    types.forEach(type=>{
        let typeDatas = allTypes.find(t=> type.id == t.id);
        if (typeDatas) price += typeDatas.price*type.amount
    });
    return price
}

const GetFullPrice = async (ticketsList, eventId)=>{           //ticketsList : [{ticketId : string, amount : number ...}...]
    console.log(ticketsList);
    if (ticketsList.length && typeof ticketsList[0] == "object" && Object.keys(ticketsList[0]).includes("ticketId") && eventId){
        const ticketDatas = await getTicketByReadableId(eventId);
        console.log("ticketDatas", ticketDatas);
        let amountList = [];
        let fullPrice = 0;
        let fullAmount = 0;
        if (ticketDatas){
            for (let i = 0; i < ticketsList.length; i++){
                if (ticketsList[i].amount && ticketDatas.tickets.length){
                    let typeData = ticketDatas.tickets.find(l=>l.id == ticketsList[i].ticketId);
                    ticketsList[i].types = getPricesByTypes(ticketsList[i].types, typeData.types)
                    amountList.push({name: ticketDatas.tickets.find(ticket=>ticket.id === ticketsList[i].ticketId).name, price : getPriceOfTypes(ticketsList[i].types, typeData.types), unitPrice : ticketDatas.tickets.find(ticket=>ticket.id === ticketsList[i].ticketId).price, ...ticketsList[i]});
                    fullAmount += ticketsList[i].amount;
                    fullPrice += getPriceOfTypes(ticketsList[i].types, typeData.types);
                }
                else{
                    return {
                        error : true,
                        errorCode : "400"
                    }
                }
            }
        }
        else{
            return {
                error : true,
                errorCode : "400"
            }
        }
        return {tickets : amountList, fullPrice : fullPrice, fullAmount : fullAmount}
    }
    return {
        error : true,
        errorCode : "400"
    }
}

module.exports = GetFullPrice;