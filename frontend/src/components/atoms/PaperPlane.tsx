import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const PaperPlaneIcon = () => {
  return (
    <Image
      style={styles.image}
      source={require('../../../assets/paperplane-light.png')}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
  },
});

export default PaperPlaneIcon;
