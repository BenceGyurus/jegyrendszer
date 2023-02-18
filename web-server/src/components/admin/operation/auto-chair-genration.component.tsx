import { useState } from "react";
type ChairsType = {
    posX : number,
    posY : number,
    id : string,
    name : string,
    title: string
}

type functionType = {functionName : any, sizeOfChairs : number};
const AutoGenerateChairs = (params:functionType)=>{
    const [Position, setPos] = useState("");
    const [Side, setSide] = useState("");
    const [NumberOfRow, setNumberOfRow] = useState(0);
    const [NumberOfChairInARow, setNumberOfChairInARow] = useState(0);
    const [margin, setMargin] = useState(2);


    function romanize (num:number):any{
        var romanMatrix:any = [[1000, 'M'],[900, 'CM'],[500, 'D'],[400, 'CD'],[100, 'C'],[90, 'XC'],[50, 'L'],[40, 'XL'],[10, 'X'],[9, 'IX'],[5, 'V'],[4, 'IV'],[1, 'I']];
        if (num === 0) {
            return '';
          }
          for (var i = 0; i < romanMatrix.length; i++) {
            if (num >= romanMatrix[i][0]) {
              return romanMatrix[i][1] + romanize(num - romanMatrix[i][0]);
            }
          }
    }

    const generate = ()=>{
        let array:Array<Array<ChairsType>> = [];
        for (let i = 0; i < NumberOfRow; i++){
            array.push([]);
            for (let j = 0; j < NumberOfChairInARow; j++){
                array[i].push({name : `${Position}, ${Side} ${romanize(i+1)}.sor ${j+1}.szék`, posX : j*(params.sizeOfChairs+margin), posY : i*(params.sizeOfChairs+margin), id :String(Math.ceil(Math.random()*999999)), title : ""});
            }
        }
        params.functionName(array);
    }    

    return (
        <div>
            <label htmlFor="pos">Csoport helye (pl. földszint)</label>
            <input type="text" placeholder="Földszint" id = "pos" onChange={event => setPos(event.target.value)}/>
            <label htmlFor="side">Csoport oldala (pl.Közép)</label>
            <input type="text" id = "side" placeholder="Közép" onChange={event => setSide(event.target.value)}/>
            <label htmlFor="numberOfRow">Sorok száma</label>
            <input type="number" name="numberOfRow" id="numberOfRow" onChange={event => setNumberOfRow(Number(event.target.value))}/>
            <label htmlFor="numberOfChairInARow">Székek száma 1 sorban</label>
            <input type="number" name="numberOfChairInARow" id="numberOfChairInARow" onChange={event => setNumberOfChairInARow(Number(event.target.value))}/>
            <input type="button" value="Generálás" onClick={generate}/>
        </div>
    )
}

export default AutoGenerateChairs;