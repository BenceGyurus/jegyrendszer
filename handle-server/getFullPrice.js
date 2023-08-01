const getTicketByReadableId = require("./getTicketByReadableId")


const GetFullPrice = async (ticketsList, eventId)=>{           //ticketsList : [{ticketId : string, amount : number ...}...]
    if (ticketsList.length && typeof ticketsList[0] == "object" && Object.keys(ticketsList[0]).includes("ticketId") && eventId){
        const ticketDatas = await getTicketByReadableId(eventId);
        let amountList = [];
        let fullPrice = 0;
        let fullAmount = 0;
        if (ticketDatas){
            for (let i = 0; i < ticketsList.length; i++){
                if (ticketsList[i].amount && ticketDatas.tickets.length){
                    amountList.push({price : ticketsList[i].amount * ticketDatas.tickets.find(ticket=>ticket.id === ticketsList[i].ticketId).price, unitPrice : ticketDatas.tickets.find(ticket=>ticket.id === ticketsList[i].ticketId).price, ...ticketsList[i]});
                    fullAmount += ticketsList[i].amount;
                    fullPrice = ticketsList[i].amount*ticketDatas.tickets.find(ticket=>ticket.id === ticketsList[i].ticketId).price;
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