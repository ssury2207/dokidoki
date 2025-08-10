import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal, Text } from "react-native";

interface FullScreenLoaderProps {
  visible: boolean;
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ visible, message }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#37B9C5" />
          {message ? <Text style={styles.loaderText}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: "white",
    padding: 32,
    borderRadius: 18,
    alignItems: "center",
  },
  loaderText: {
    marginTop: 16,
    fontWeight: "600",
    fontSize: 17,
    color: "#37B9C5",
  },
});

export default FullScreenLoader;
