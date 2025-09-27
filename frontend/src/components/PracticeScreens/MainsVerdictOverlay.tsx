import { View, StyleSheet } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Title from "../atoms/Title";
import NormalText from "../atoms/NormalText";
import PrimaryButton from "../atoms/PrimaryButton";
import { uploadImageToCloudinary } from "@/src/api/uploadImageToCloudinary";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import FullScreenLoader from "../common/FullScreenLoader";
import { useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentStreak, setPoints } from "@/store/userProgressSlice";

type Props = {
  verdict: boolean;
};

import submitMainsData from "@/src/utils/submitMainsData";
import SecondaryButton from "../atoms/SecondaryButton";

const MainsVerdictOverlay: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { uid, uploadCopies, prelims_solved, mains_solved, data, date } =
    route.params;
  const db = getFirestore();
  const today = new Date().toISOString().substring(0, 10);

  const [loaderVisible, setLoaderVisible] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const dispatch = useDispatch<AppDispatch>();

  const points = useSelector(
    (state: RootState) => state.userProgress.totalPoints
  );
  const curr_streak = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const longest_streak = useSelector(
    (state: RootState) => state.userProgress.longest_streak
  );
  // async function uploadImagesArrayParallel( userId: string,
  //   images: { id: number; uri: string }[] )
  //   { const uploadPromises = images.map((img) => uploadImageToCloudinary(img.uri) ); const downloadURLs = await Promise.all(uploadPromises); await updateDoc(doc(db, 'users', userId),
  //   { [submissions.mains.answerCopies.${today}]: downloadURLs, }); }
  const overlaySubmitButtonHandler = async () => {
    if (!uid) return;

    try {
      setLoaderVisible(true);

      if (mains_solved) {
        alert("You have already submitted today's mains answer.");
        return;
      }

      // Step 1: Upload answer copies
      const downloadURLs = await Promise.all(
        uploadCopies.map((img) => uploadImageToCloudinary(img.uri))
      );

      // Step 2: Prepare points and streak updates
      const points_awarded = 5;
      const updated_points = points + points_awarded;
      const updated_streak = prelims_solved ? curr_streak : curr_streak + 1;

      const isCurrentDay = date === new Date().toISOString().substring(0, 10);

      // Step 3: Submit mains data
      await submitMainsData({
        uid,
        todays_date: today,
        total_points: isCurrentDay ? updated_points : points,
        points_awarded,
        current_streak: isCurrentDay ? updated_streak : curr_streak,
        longest_streak,
        question_date: data.date,
        questionId: data.questionId,
        Question: data.Question,
        submission_uri: downloadURLs,
      });

      // Step 4: Update UI and local state
      if (!prelims_solved && isCurrentDay) {
        dispatch(setCurrentStreak(updated_streak));
      }
      isCurrentDay && dispatch(setPoints(updated_points));
      
      // Navigate to CreatePostOverlay after successful submission
      navigation.dispatch(StackActions.pop(2));
      navigation.navigate("CreatePostOverlay", {
        images: downloadURLs, // Pass the uploaded image URLs
        question: data.Question,
        year: data.Year?.toString(),
        paper: data.Paper,
      });
    } catch (error: any) {
      alert(error?.message || "Mains submission failed.");
      console.error("Mains submission error:", error);
      navigation.goBack();
    } finally {
      setLoaderVisible(false);
    }
  };

  const overlayBackButtonHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <Title title="Have you added all the Photos?" />

        <View style={styles.row}>
          <NormalText text="All your added photos will be uploaded once you click Submit" />
        </View>

        <PrimaryButton
          isActive={true}
          submitHandler={overlaySubmitButtonHandler}
          title="Submit"
        />
        <SecondaryButton
          isActive={true}
          submitHandler={overlayBackButtonHandler}
          title="Back"
        />
      </View>
      <FullScreenLoader
        visible={loaderVisible}
        message="Uploading, please wait..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
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
    alignItems: "center",
  },
});

export default MainsVerdictOverlay;
