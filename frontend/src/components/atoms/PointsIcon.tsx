import { StyleSheet, Image } from 'react-native';
import React from 'react';
const points = require('../../../assets/points.png');

const PointsIcon = () => {
  return <Image style={styles.image} source={points} />;
};

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});

export default PointsIcon;
