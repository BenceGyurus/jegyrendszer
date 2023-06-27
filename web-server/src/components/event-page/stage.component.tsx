import "../../css/user-side-stage.css";

type typeOfStageParams = {
    sizeOfArena : {width : number, height: number},
    classNameList : Array<string>,
    isVertical? : boolean
}


const Stage = ({sizeOfArena, classNameList, isVertical}:typeOfStageParams)=>{

    const generateClassName = (classNames:Array<string>)=>{
        let classname = "";
        for (let i = 0; i < classNames.length; i++){
            if (i < classNames.length){
                classname += `${classNames[i]} `;
            }
            else{
                classname += `${classNames[i]}`;
            }
        }
        return classname;
    }


    return (
        <div className = {`user-page-stage ${generateClassName(classNameList)}`} style = {{width : isVertical ? window.innerWidth*0.05 : window.innerWidth*0.8 < 800 ? window.innerWidth*0.4 : 800*0.4, height : isVertical ? sizeOfArena.height*0.6 : 80, position : "relative"}} ></div>
    )
}

export default Stage;