import React, { cloneElement, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, useColorScheme, Pressable } from 'react-native';
import typeOfPopUpWindowParams from './types/popUpWindowParams';
import popUpWindowStyle from './style/popUpWindowStyle';
import Theme from '../../theme/defaultSettings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'

const screenHeight = Dimensions.get('window').height;

const PopUpWindow = ({ isVisible, children, closeFunction }:typeOfPopUpWindowParams) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? screenHeight * 0.2 : screenHeight,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], backgroundColor : useColorScheme()==="dark" ? Theme.dark.background : Theme.light.background }]}>
        <View style={{zIndex : 30, alignContent : "flex-end", padding : 10, alignItems : "flex-end"}}><Pressable style = {{width : 50, height : 50}} onPress={()=>{if (closeFunction) {console.log("close");closeFunction()}}}><FontAwesomeIcon style={{zIndex : 29}} size={40} icon = {faXmark} /></Pressable></View>
        <View style = {popUpWindowStyle.container}>
      {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -(screenHeight-(screenHeight * 0.2)),
    left: 0,
    right: 0,
    height: screenHeight * 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
  },
});


export default PopUpWindow;
