
const ElementChairsDatas = (params:any)=>{
    return params.chairs.map((chair:any, index:number)=>{
        return (
            <div key={chair.id}>
                <label>Ülőhely elnevezése</label>
                <input type="text" className="datasInput" defaultValue = {chair.name} id = "nameOfChair" onChange={event=>params.changeValueOfName(event, index)} />
                <label>Ülőhely felirata</label>
                <input type="text" className = "datasInput" id = "priceOfChair" onChange={event=>params.changeValueOfTitle(event, index)} defaultValue = {chair.title}/>
                <input type="button" value="Törlés" onClick={event=>params.deleteThis(event, index)} />
            </div>
        ); 
    }).reverse();
}

//onChange={params.changeValue(index, "name", chair.id, chair.name, chair.price, chair.posX, chair.posY)}

export default ElementChairsDatas;