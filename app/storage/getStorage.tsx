import AsyncStorage from '@react-native-async-storage/async-storage';

const getLocalStorage = async (key:string)=>{
    try{
        return await AsyncStorage.getItem(key);
    }
    catch{
        return false;
    }
}

export default getLocalStorage