import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#1a73e8" /> 
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position : "absolute",
    top: "45%",
    left: "45%"
  },
});

export default Loader;
