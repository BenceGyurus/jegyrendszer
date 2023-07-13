type typeOfData = {
    amount : number,
    backgroundColor : string,
    id : string,
    name : string
}

type typeOfTicketRatioParams = {
    datas : Array<typeOfData>
}

const TicketRatio = ({datas}:typeOfTicketRatioParams)=>{

    console.log(datas);

    return (
        <div>
            {
                datas.map((element)=>{
                    return (
                        <div>
                            <span>{element.name}:</span>
                            <span>{element.amount}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

/*datas.map((element)=>{
                    return 
                })*/

export default TicketRatio;