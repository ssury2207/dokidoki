import { StyleSheet, Image } from 'react-native';
import React from 'react';
const logout_light = require('../../../assets/logout-white.png');
const logout_dark = require('../../../assets/logout-black.png');
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const LogoutIcon = () => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <Image style={styles.image} source={theme ? logout_light : logout_dark} />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
});

export default LogoutIcon;
