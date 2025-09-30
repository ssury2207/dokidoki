import { View, TextInput, ScrollView } from "react-native";
import Title from "../atoms/Title";
import NormalText from "../atoms/NormalText";
import PrimaryButton from "../atoms/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import SecondaryButton from "../atoms/SecondaryButton";
import FixedImageCarousel from "../common/FixedImageCarousel";
import Checkbox from "../atoms/Checkbox";
import DisclaimerText from "../atoms/DisclaimerText";
import { RootStackParamList } from "@/src/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "@/src/firebaseConfig";
import { Alert } from "react-native";
import FullScreenLoader from "../common/FullScreenLoader";

type CreatePostOverlayProps = NativeStackScreenProps<
  RootStackParamList,
  "CreatePostOverlay"
>;

const CreatePostOverlay = ({ navigation, route }: CreatePostOverlayProps) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const userName = useSelector(
    (state: RootState) => state.userProgress.userName
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const images = route.params?.images || [];
  const question = route.params?.question || "";
  const year = route.params?.year || "";
  const paper = route.params?.paper || "";
  const questionId = route.params?.questionId || "";

  const overlayButtonHandler = () => {
    navigation.goBack();
  };

  const postButtonHandler = async () => {
    // Validate user authentication
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a post");
      return;
    }

    // Validate username
    if (!userName) {
      Alert.alert("Error", "Username not found. Please try logging in again.");
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();
      const postData = {
        authorId: user.uid,
        username: isAnonymous ? "Anonymous" : userName,
        question: question,
        year: year,
        paper: paper,
        questionId: questionId,
        isAnonymous: isAnonymous,
        images: images,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
      };

      // Add post to Firestore
      const docRef = await addDoc(collection(db, "posts"), postData);

      setLoading(false);
      
      // First go back to close the overlay, then navigate to PostDetail
      navigation.goBack();
      
      // Use a slight delay to ensure the overlay is closed before navigation
      setTimeout(() => {
        navigation.navigate("PostDetail", { postId: docRef.id });
      }, 100);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to create post. Please try again.");
      console.error("Error creating post:", error);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    navigation.navigate("FullScreenImageViewer", { imageUrl });
  };
  return (
    <View style={styles.overlay}>
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <NormalText text="Share with your peers now!!" />

          {images.length > 0 && (
            <FixedImageCarousel
              images={images}
              onImagePress={handleImagePress}
            />
          )}

          <Checkbox
            isChecked={isAnonymous}
            onToggle={() => setIsAnonymous(!isAnonymous)}
            label="Post Anonymous"
          />
          <DisclaimerText text="*Your username will not be shown" />

          <PrimaryButton
            title="Post"
            isActive={true}
            submitHandler={postButtonHandler}
          />
          <SecondaryButton
            title="Cancel"
            isActive={true}
            submitHandler={overlayButtonHandler}
          />
        </ScrollView>
      </View>
      <FullScreenLoader visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxHeight: "85%",
  },
  modalBGLight: {
    backgroundColor: "white",
  },
  modalBGDark: {
    backgroundColor: "#222831",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    borderColor: "#CCCC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  inputColorLight: {
    color: "#50555C",
  },
  inputColorDark: {
    color: "#CCCC",
  },
});

export default CreatePostOverlay;
