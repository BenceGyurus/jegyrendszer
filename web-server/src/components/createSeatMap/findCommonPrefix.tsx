function findCommonPrefix(arr:Array<any>, key:string) {
    if (arr.length === 0) {
      return '';
    }
  
    const values = arr.map(obj => obj[key]);
  
    // Sorrendezzük az értékeket hossz szerint növekvő sorrendben
    values.sort((a, b) => a.length - b.length);
  
    const shortestValue = values[0];
    let commonPrefix = '';
  
    // Ellenőrizzük, hogy a legrövidebb érték a többi érték eleje
    for (let i = 0; i < shortestValue.length; i++) {
      const prefix = shortestValue.slice(0, i + 1);
      if (values.every((value:string) => value.startsWith(prefix))) {
        commonPrefix = prefix;
      } else {
        break;
      }
    }
  
    return commonPrefix;
  }

  export default findCommonPrefix;