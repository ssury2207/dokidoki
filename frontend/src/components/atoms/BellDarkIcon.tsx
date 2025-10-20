import { StyleSheet, Image } from 'react-native';
import React from 'react';

const BellDarkIcon = () => {
  return (
    <Image
      style={styles.image}
      source={require('../../../assets/bell-dark.png')}
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

export default BellDarkIcon;
