import { StyleSheet, Image } from 'react-native';
import React from 'react';

const RedCrossIcon = () => {
  return (
    <Image
      style={styles.image}
      source={require('../../assets/red-cross.png')}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
    margin: 4,
  },
});

export default RedCrossIcon;
