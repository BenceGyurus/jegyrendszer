const RadioButtons = (params:any)=>{
    return (<div key = {String(Math.ceil(Math.random()*1000))}>
        <p className = "titleOfRadioButton">{params.title}</p>
        {params.datas.map((data:any)=>{
            return (
              <div key={String(Math.ceil(Math.random()*1000))}>
                <label htmlFor={data.id}>{data.answer}</label>
                <input type="radio" name={params.name} id={data.id}  key = {data.id} value = {data.value}  onChange = {params.eventListener}/>
              </div>  
            )
        })}
        </div>
    )
}

export default RadioButtons;