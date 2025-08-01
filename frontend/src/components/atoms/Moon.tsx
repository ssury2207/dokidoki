import { StyleSheet, Image } from 'react-native';
import React from 'react';

const MoonIcon = () => {
  return (
    <Image style={styles.image} source={require('../../../assets/moon.png')} />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
    marginHorizontal: 10,
  },
});

export default MoonIcon;
