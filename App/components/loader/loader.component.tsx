import React from 'react';
import {ActivityIndicator, StyleSheet, View, useColorScheme} from 'react-native';
import styles from "./loader.style";
import Theme from '../../theme/defaultSettings';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Loader = () => (
  <View style={[styles.container, styles.horizontal, {backgroundColor : useColorScheme()=== "dark" ? Colors.darker : Colors.lighter,}]}>
    <ActivityIndicator color={Theme.default.borderColor}  />
  </View>
);



export default Loader;