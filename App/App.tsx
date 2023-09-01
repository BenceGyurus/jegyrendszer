import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import getLocalStorage from './storage/getStorage';
import LoginPage from './component/loginPage/loginPage.component';
import postData from './requests/post';
import Loader from './component/loader/loader.component';
import BasicStyle from './defaultStyles/style';
import defaultSettings from './defaultSettings';
import controlToken from './control-token';
import EventList from './component/eventList/eventList.component';
function App(){
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState("");
  const [loader, setLoader] = useState(false);

  const backgroundStyle = {
    backgroundColor: defaultSettings.isDark ? Colors.darker : Colors.lighter,
  };

  

  useEffect(()=>{
    controlToken().then((response:any)=>{
      if (response) setToken(response);
    });
  },[]);

console.log(token);

  return (
     <SafeAreaView style = {{backgroundColor : defaultSettings.isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor}}>
      {!token ? <LoginPage reloadEvent = {controlToken} loaderFunction = {setLoader} /> : <EventList />}
      {loader ? <Loader /> : ""}
     </SafeAreaView>
  );
}

export default App;


/* <SafeAreaView style={backgroundStyle}>
      {isTokenValid ? <></> : <LoginPage isDark={isDarkMode} />}
    </SafeAreaView>*/

//<LoginPage isDark = {isDarkMode} defaultUrl={basicUrl} />
/*
<Header />
      <FullHeightScroll
      isDark = {isDarkMode}
      children={
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white
          }}>
            {events.length ? <MainEventList eventDatas={events} basicUrl={basicUrl} isDark = {isDarkMode} /> : <View><Text style = {{color : "red"}}>Jelenleg nincs esemény</Text></View>}</View> }/>
            */