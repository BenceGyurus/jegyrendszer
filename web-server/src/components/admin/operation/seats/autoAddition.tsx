type seatOfType = {
    name : string,
    title : string,
    id : string,
    posX : number,
    posY : number,
    group : string
}

function detectNewGroup(groups:any){
    let detectedGroups:Array<string> = [];
    let newGroups:Array<Array<string>> = [];
    for (let i = 0; i < groups.length; i++){
        let eGroup:Array<string> = [];
        let added = false;
        for (let j = 0; j < groups[i].elements.length; j++){
            if (detectedGroups.includes(groups[i].elements[j].group) && !added ){
                if (groups[i].elements.length >= 3){
                    eGroup.push(groups[i].elements[j].id);
                }
            }else{
                added = true;
                detectedGroups.push(groups[i].elements[j].group)
            }
            //detectedGroups.includes(groups[i].elements[j].group) ? groups[i].elements.length >= 3 ? newGroups[i].push(groups[i].elements[j].group) : false : detectedGroups.push(groups[i].elements[j].group);
        }
        if (eGroup.length){
            newGroups.push(eGroup);
        }
    }
    return newGroups;
}

function groupositobjects(objects:Array<seatOfType>, sizeOfSeats:number) {
  const groups = [];

  for (const object of objects) {
    const { posX, posY, ...rest } = object;
    let group = groups.find((c) => {
      const correctElements = c.elements.filter((e:any) => {
        return (
          Math.abs(e.posX - object.posX) < sizeOfSeats*2.5 &&
          Math.abs(e.posY - object.posY) < sizeOfSeats*2.5
        );
      });
      return correctElements.length > 0;
    });

    if (group) {
      group.elements.push(object);
    } else {
      groups.push({
        elements: [object],
      });
    }
  }

  let recommendedGroups = detectNewGroup(groups)

  return {detectedGroups : groups, recommendedGroups : recommendedGroups};
}

export default groupositobjects;
