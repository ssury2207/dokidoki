import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons"; // For cross icon

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
};

const AddPhotoModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onCamera,
  onGallery,
}) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={onClose}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    backdropOpacity={0.4}
    style={styles.modal}
  >
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Photo</Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.crossButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onCamera}>
          <Ionicons name="camera-outline" size={28} color="#37B9C5" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onGallery}>
          <Ionicons name="image-outline" size={28} color="#37B9C5" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  crossButton: {
    padding: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  actionButton: {
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#F4F6FA",
    width: 110,
  },
  buttonText: {
    marginTop: 8,
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AddPhotoModal;
