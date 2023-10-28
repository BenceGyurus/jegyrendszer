import typeOfGroup from "./type/group";
import typeOfSeat from "./type/seat";

const groupByCommonWords = (items: typeOfGroup[], seats: typeOfSeat[]): Record<string, { name: string }[]> => {
    const groups: Record<string, { name: string }[]> = {};

    for (const item of items) {
        if (seats.filter(seat=>{return seat.group === item.id}).length){
            const words = item.name.split(' ');
            const commonWord = words[0];

            if (!groups[commonWord]) {
            groups[commonWord] = [];
            }

            groups[commonWord].push(item);
        }
    }

    return groups;
}

export default groupByCommonWords;