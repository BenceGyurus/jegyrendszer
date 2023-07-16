import AsyncStorage from '@react-native-async-storage/async-storage';

const addLocalStorage = async (key:string, value:string)=>{
    await AsyncStorage.setItem(
        key,
        value
      );
}

export default addLocalStorage;