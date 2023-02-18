import React,{useState} from "react";
import Chair from "./chair.component";
import "../../../css/chairs.css";
import ElementChairsDatas from "./chairsSettingsList";
import AutoGenerateChairs from "./auto-chair-genration.component";
type ChairsType = {
    posX : number,
    posY : number,
    id : string,
    name : string,
    title: string
}
const GenerateChairs = (params:any):any=>{
    const [ChairsOfPositions, setChairsOfPositions] = useState(Array<ChairsType>); 
    const [sizeOfElements, setSizeOfElements] = useState(20);
    const handleClick = (event:any)=>{
        if (event.target.className === "SitEditorPanel"){
        let newData = [...ChairsOfPositions];
        newData.push({posX: event.pageX, posY : event.pageY, id : String(Math.ceil(Math.random()*1000)), name : "", title: ""});
        setChairsOfPositions(newData);
        }
    }

    const createNewArray = (array:Array<ChairsType>)=>{
        let newArray:Array<ChairsType> = [];
        array.forEach((element:ChairsType)=>{
            if (element){
                newArray.push(element);
            }
        });
        return newArray;
    }

    const changeValueOfName = (event:any, index:number)=>{ //, index:number, key:string, id:string, name:string, price:number, x:number, y:number
        let newData = [...ChairsOfPositions];
        newData[index] = {posX : newData[index].posX, posY : newData[index].posY, id : newData[index].id, name : event.target.value, title: newData[index].title};
        setChairsOfPositions(newData);
    }

    const changeValueOfTitle = (event:any, index:number)=>{
        let newData = [...ChairsOfPositions];
        newData[index] = {posX : newData[index].posX, posY : newData[index].posY, id : newData[index].id, name : newData[index].name , title: event.target.value};
        setChairsOfPositions(newData);
    }

    const setPos = (x:number,y:number,index:number)=>{
        let newData = [...ChairsOfPositions];
        newData[index] = {posX : x, posY : y, id : newData[index].id, name : newData[index].name, title: newData[index].title};
        setChairsOfPositions(newData);
    }

    const deleteThis = (event:unknown, index:number)=>{
        let newData = [...ChairsOfPositions];
        delete newData[index];
        newData = createNewArray(newData);
        setChairsOfPositions(newData);
    }

    const setChair = (event:any, index:number)=>{

    }

    const createChairs = (array:Array<Array<ChairsType>>)=>{
        let newData = [...ChairsOfPositions];
        for (let i = 0; i < array.length; i++){
            for (let j = 0; j < array[i].length; j++){
                newData.push(array[i][j]);
            }
        }
        setChairsOfPositions(newData);
    }

    return (
        <div>
        <div className = "SitEditorPanel" onClick={handleClick}>
        {ChairsOfPositions.map((chair:any, index)=>{
            return <Chair posX = {chair.posX} posY = {chair.posY} id = {chair.id} key = {chair.id} size = {sizeOfElements} setPos = {setPos} index = {index} name = {chair.name} title = {chair.title} onClickEvent = {setChair} />
        })}
        </div>
        <div className="chairsSettings">
            <ElementChairsDatas chairs = {ChairsOfPositions} changeValueOfName = {changeValueOfName} changeValueOfTitle = {changeValueOfTitle} deleteThis = {deleteThis}/>
        </div>
        <div>
            <AutoGenerateChairs functionName = {createChairs} sizeOfChairs = {sizeOfElements}/>
        </div>
        </div>
    );
}

//{ChairsOfPositions.map((chair:any)=>{return <Chair posX = {chair.posX} posY = {chair.posY} name = {chair.name} id = {chair.id} price = {chair.price} key = {chair.id} size = {sizeOfElements} dragStart = {()=>{setMoveElement(chair.id)}} upMouse = {()=>{setMoveElement("")}}/>})}

export default GenerateChairs;