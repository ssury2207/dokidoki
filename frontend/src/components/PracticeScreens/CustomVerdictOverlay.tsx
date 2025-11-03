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
import { supabase } from "@/src/supabaseConfig";

type CustomVerdictOverlayProps = {
  route: any;
  navigation: any;
};

const CustomVerdictOverlay: React.FC<CustomVerdictOverlayProps> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { uid, uploadCopies } = route.params;
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
    if (!uid) {
      alert("User not authenticated. Please log in again.");
      navigation.goBack();
      return;
    }

    if (!uploadCopies || uploadCopies.length === 0) {
      alert("No images to upload. Please add photos first.");
      navigation.goBack();
      return;
    }

    try {
      setLoaderVisible(true);

      // Step 1: Upload answer copies with error handling
      let downloadURLs: string[] = [];
      try {
        downloadURLs = await Promise.all(
          uploadCopies.map((img: { id: number; uri: string }) => uploadImageToCloudinary(img.uri))
        );
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        setLoaderVisible(false);
        alert("Failed to upload images. Please check your internet connection and try again.");
        navigation.goBack();
        return;
      }

      // Step 2: Check if user has already been active today
      const already_active_today = last_active_date === today;

      // Step 3: Prepare points and streak updates
      const points_awarded = 5;
      const updated_points = points + points_awarded;
      // Only increment streak if NOT already active today
      const updated_streak = already_active_today ? curr_streak : curr_streak + 1;

      // Step 3: Update user stats in database with error handling
      try {
        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            total_points: updated_points,
            current_streak: updated_streak,
            longest_streak: Math.max(longest_streak, updated_streak),
            last_active_date: today,
            points_history: supabase.rpc("jsonb_set_custom", {
              data: {},
              key: today,
              value: points_awarded,
            }),
          })
          .eq("id", uid);

        if (userUpdateError) {
          console.error("User stats update error:", userUpdateError);
          // Still allow navigation even if stats update fails
          alert("Submission successful, but stats may not have updated. Please refresh.");
        }
      } catch (dbError: any) {
        console.error("Database error:", dbError);
        // Continue anyway
        alert("Submission successful, but stats may not have updated. Please refresh.");
      }

      // Step 4: Update Redux state
      if (!already_active_today) {
        dispatch(setCurrentStreak(updated_streak));
      }
      dispatch(setPoints(updated_points));
      dispatch(setLastActiveDate(today));

      setLoaderVisible(false);

      // Show message if already active today
      if (already_active_today) {
        alert("Great job! You've already earned your streak for today. This submission will earn you points but won't affect your streak.");
      }

      // Step 5: Navigate to CustomPostOverlay
      navigation.goBack();
      navigation.navigate("CustomPostOverlay", {
        images: downloadURLs,
      });
    } catch (error: any) {
      console.error("Unexpected custom answer submission error:", error);
      setLoaderVisible(false);
      alert("An unexpected error occurred. Please try again.");
      navigation.goBack();
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

export default CustomVerdictOverlay;
