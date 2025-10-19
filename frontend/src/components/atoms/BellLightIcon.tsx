import { StyleSheet, Image } from 'react-native';
import React from 'react';

const BellLightIcon = () => {
  return (
    <Image
      style={styles.image}
      source={require('../../../assets/bell-light.png')}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
});

export default BellLightIcon;
