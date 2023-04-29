import Checkbox from "../../../../checkbox/checkbox.component";

type typeOfGroup = {
    id : string,
    name : string,
    opened : boolean,
    posX : number,
    posY : number,
    status : boolean,
}

type typeOfSeats = {
    posX : number,
    posY : number,
    name : string,
    title : string,
    id : string,
    colorOfSeat : string,
    group : string
}

type typesOfGroup_ListParams = {
    groups : Array<typeOfGroup>,
    changeFunction : Function,
    seats: Array<typeOfSeats>,
    seatList : Array<string>
} 
const Group_List = ({groups, changeFunction, seats, seatList}:typesOfGroup_ListParams)=>{

    const numberOfPartsOfGroup = (groupId:string)=>{
        let sum = 0;
        for (let i = 0; i < seats.length; i++){
            if (seats[i].group === groupId){sum++}
        }
        return sum
    }

    const controlGroup = (group:typeOfGroup)=>{
        let s = 0;
        for (let i = 0; i < seatList.length; i++){
            let groupId:any = seats.filter((seat)=>seat.id === seatList[i])[0];
            if (groupId && groupId.group === group.id){
                s++;
            }
        }
        if (s === numberOfPartsOfGroup(group.id)){return false}
        else{return true;}
    };

    return <div>
        {
            groups.map((group:typeOfGroup)=>{
                return controlGroup(group) ? <Checkbox onChangeFunction={changeFunction} defaultChecked = {false} title = {group.name} params = {[seats.filter(seat=>seat.group == group.id)]} /> : ""
            })
        }
    </div>
    ;
}

export default Group_List;