import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setCurrentStreak, setPoints, setLastActiveDate } from "@/store/userProgressSlice";
import Title from "../atoms/Title";
import NormalText from "../atoms/NormalText";
import PrimaryButton from "../atoms/PrimaryButton";
import SecondaryButton from "../atoms/SecondaryButton";
import FullScreenLoader from "../common/FullScreenLoader";
import { uploadImageToCloudinary } from "@/src/api/uploadImageToCloudinary";
import submitMainsData from "@/src/utils/submitMainsData";
import { Alert } from "react-native";

type Props = {
  verdict: boolean;
};

const MainsVerdictOverlay: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { uid, uploadCopies, prelims_solved, mains_solved, data, date } =
    route.params;
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
  const last_active_date = useSelector(
    (state: RootState) => state.userProgress.last_active_date
  );
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
        uploadCopies.map((img: { id: number; uri: string }) => uploadImageToCloudinary(img.uri))
      );

      // Step 2: Prepare points and streak updates
      const points_awarded = 5;
      const updated_points = points + points_awarded;
      // Check if user was already active today (via prelims OR custom post)
      const already_active_today = prelims_solved || (last_active_date === today);
      const updated_streak = already_active_today ? curr_streak : curr_streak + 1;

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
      if (!already_active_today && isCurrentDay) {
        dispatch(setCurrentStreak(updated_streak));
      }
      isCurrentDay && dispatch(setPoints(updated_points));
      isCurrentDay && dispatch(setLastActiveDate(today));

      // Show notification if user was already active today
      if (already_active_today && isCurrentDay) {
        Alert.alert(
          "Great job!",
          "You've already earned your streak for today. This submission will earn you points but won't affect your streak."
        );
      }
      
      // Navigate to CreatePostOverlay after successful submission
      // Pop only this overlay (MainsVerdictOverlay), keeping MainsScreen in the stack
      navigation.goBack();

      // Then navigate to CreatePostOverlay from MainsScreen
      navigation.navigate("CreatePostOverlay", {
        images: downloadURLs, // Pass the uploaded image URLs
        question: data.Question,
        year: data.Year?.toString(),
        paper: data.Paper,
        questionId: data.id || data.questionId, // Add questionId for post tracking
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
