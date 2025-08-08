import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";

const FullScreenImageViewer = ({ route, navigation }) => {
  const { imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default FullScreenImageViewer;
