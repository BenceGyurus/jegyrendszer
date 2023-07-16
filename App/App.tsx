import React, { useEffect, useState } from 'react';
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
import LoadEvents from './component/loadEvents/loadEvents.component';
import postData from './requests/post';
import Loader from './component/loader/loader.component';
import BasicStyle from './defaultStyles/style';

function App(){
  const isDarkMode = useColorScheme() === 'dark';
  const [basicUrl, setBasicUrl] = useState("http://192.168.1.216:3000");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState("");
  const [loader, setLoader] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const controlToken = ()=>{
    getLocalStorage("long_token").then(long_token=>{
      if (long_token){
        postData(`${basicUrl}/get-access`, {token : long_token})
        .then(response=>{
          if (response.access){
            setToken(long_token);
          }
          else{
            setToken("");
          }
        })
      }
    })
  }

  useEffect(()=>{
    controlToken();
  },[]);


  return (
     <SafeAreaView style = {{backgroundColor : isDarkMode ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor}}>
      {!token ? <LoginPage isDark = {isDarkMode} defaultUrl={basicUrl} reloadEvent = {controlToken} loaderFunction = {setLoader} /> : <LoadEvents controlTokenFunction={controlToken} isDark = {isDarkMode} basicUrl={basicUrl} />}
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