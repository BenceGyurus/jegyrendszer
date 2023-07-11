type typeOfDatas = {
    date : number,
    fullPrice : number,
    amount : number,
    bought : boolean,
    tickets : Array<any>
}

type typeOfTicketDatas = {
    id : string,
    eventName : string,
    image : string,
    datas : Array<typeOfDatas>
}

type typeOfTicketStatsParams = {
    datas : Array<typeOfTicketDatas>
}

const TicketStats = ({datas}:typeOfTicketStatsParams)=>{
    const calcDatas = (datas:Array<typeOfDatas>)=>{
        let amountOfPendingTickets = 0;
        let amountOfSoldTickets = 0;
        let soldPrice = 0;
        datas.forEach((element) => {
            if (element.bought){
                amountOfSoldTickets+=element.amount;
                soldPrice += element.fullPrice
            }
            else{
                amountOfPendingTickets+=element.amount
            }
            });
        return {pending : amountOfPendingTickets, sold : amountOfSoldTickets, fullIncome : soldPrice};
    }


    return (
        <div>
            {datas.map((element)=>{
                let statistics = calcDatas(element.datas);
                return (
                    <div>
                        <img src={element.image} alt="" />
                        <h2>{element.eventName}</h2>
                        <h3>Eddigi összes bevétel: {statistics.fullIncome}</h3>
                        <h3>Összes eladott jegy száma: {statistics.sold}</h3>
                        <h3>Függőben lévő jegyek száma: {statistics.pending}</h3>
                    </div>
                );
            })}
        </div>
    );
}

export default TicketStats;