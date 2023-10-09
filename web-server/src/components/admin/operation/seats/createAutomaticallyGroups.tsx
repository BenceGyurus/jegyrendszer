import { v4 as uuid } from 'uuid';
import seatOfType from './type/seat';
const createAutoGroups = (groups:Array<Array<string>>, seats:Array<seatOfType>, changeSeatsFunctions:Function, addGroupsFunction:Function, oldGroups:Array<any>)=>{
    let newGroups = [];
    for (let i = 0; i < groups.length; i++){
        let id = uuid();
        newGroups.push({name : `Generált csoport ${i+1}`,id : id ,posX : 0, posY : 0, status : false, opened: false});
        //let id = //addGroupsFunction(`Autómatikusan generált csoport ${i+1}`,0,0);
        for (let j = 0; j < groups[i].length; j++){
            let index = seats.findIndex((element, index, array) => { return element.id === groups[i][j] ? true : false });
            seats[index].group = id;
        }
    }
    addGroupsFunction(newGroups);
    changeSeatsFunctions(seats);
}
export default createAutoGroups;