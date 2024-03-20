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
        <div className = {`user-page-stage ${generateClassName(classNameList)}`} ></div>
    )
}

export default Stage;