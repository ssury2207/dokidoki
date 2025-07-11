import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import AddPhotoModal from "../atoms/AddPhotoModal";

interface ImageData {
  id: number;
  uri: string;
}

const AddPhotosComponents = () => {
  const [id, setId] = useState(0); // This will have to be set to persist the images uploaded
  const [data, setData] = useState<{ id: number; uri: string }[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);

  const requestCameraPermissionBeforeUpload = async () => {
    try {
      const { status, canAskAgain } =
        await ImagePicker.getCameraPermissionsAsync();

      if (status === "granted") {
        await uploadImage();
      } else if (canAskAgain) {
        const { status: newStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (newStatus === "granted") {
          await uploadImage();
        } else {
          Alert.alert(
            "Permission denied",
            "Camera access is required to take photos."
          );
        }
      } else {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access in your device settings to use this feature.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } catch (error) {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const saveImage = async (image: string): Promise<void> => {
    try {
      setIsShowModal(false);
      setId((id) => id + 1);
      setData((prevData: ImageData[]) => [...prevData, { id: id, uri: image }]);
    } catch (error) {
      console.log("Error in Saving Image", error);
    }
  };

  const uploadImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enables cropping
        aspect: [4, 3], // Aspect ratio for cropping - Keep it as full screen view
        quality: 1,
      });
      if (!result.canceled) {
        // save image
        await saveImage(result.assets[0].uri);
      } else {
        alert("No Photo taken");
      }
    } catch (error) {
      alert("Error uploading image: " + error);
      setIsShowModal(false);
    }
  };

  const pickImage = async () => {
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enables cropping
        aspect: [4, 3], // Aspect ratio for cropping
        quality: 1, // Highest quality
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      } else {
        alert("No image selected");
      }
    } catch (error) {
      alert("Error while picking up image" + error);
    }
  };

  const addPhotoHandler = () => {
    setIsShowModal(true);
  };

  const deletePhotoHandler = (id: number) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity
        onPress={addPhotoHandler}
        style={styles.addPhotoContainer}
      >
        <Text style={styles.addPhotoText}>+ Add Photo</Text>
      </TouchableOpacity>

      {data.map((item) => (
        <View key={item.id} style={styles.fileItem}>
          <Text style={styles.fileText}>{item.id}.jpg</Text>
          <Image source={{ uri: item.uri }} style={{ height: 50, width: 50 }} />
          <TouchableOpacity onPress={() => deletePhotoHandler(item.id)}>
            <Text style={{}}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <AddPhotoModal
        isVisible={isShowModal}
        onClose={() => setIsShowModal(false)}
        onCamera={() => requestCameraPermissionBeforeUpload()}
        onGallery={() => pickImage()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    width: "100%",
    marginVertical: 20,
  },
  addPhotoContainer: {
    borderColor: "#E6E7ED",
    borderRadius: 10,
    justifyContent: "space-around",
    borderWidth: 1,
    marginBottom: 10,
  },
  addPhotoText: {
    color: "#37B9C5",
    fontWeight: "700",
    padding: 10,
    textAlign: "center",
  },
  fileItem: {
    borderColor: "#FFC618",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
  },
  fileText: {
    color: "#37B9C5",
    fontWeight: "700",
    fontStyle: "italic",
  },
});

export default AddPhotosComponents;
