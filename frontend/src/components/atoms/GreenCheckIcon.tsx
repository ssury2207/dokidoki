import { StyleSheet, Image } from "react-native";
import React from "react";

const GreenCheckIcon = () => {
  return (
    <Image
      style={styles.image}
      source={require("../../assets/check-icon.png")}
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

export default GreenCheckIcon;
