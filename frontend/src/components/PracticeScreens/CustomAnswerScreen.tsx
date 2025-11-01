import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { useState } from "react";
import AddPhotosComponents from "../common/AddPhotosComponent";
import PrimaryButton from "../atoms/PrimaryButton";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import UserStats from "../common/UserStats";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/src/supabaseConfig";
import FullScreenLoader from "../common/FullScreenLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { RootStackParamList } from "@/src/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CardTitle from "../atoms/CardTitle";
import DisclaimerText from "../atoms/DisclaimerText";
import { useFocusEffect } from "@react-navigation/native";

type CustomAnswerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CustomAnswerScreen"
>;

const CustomAnswerScreen = ({ navigation }: CustomAnswerScreenProps) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [uploadCopies, setUploadCopies] = useState<
    { id: number; uri: string }[]
  >([]);
  const [uid, setUid] = useState<string | null>(null);

  // Get current user ID from Supabase
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUid(user?.id || null);
    };
    getUserId();
  }, []);

  // Clear upload state when screen comes into focus (after returning from post creation)
  useFocusEffect(
    React.useCallback(() => {
      // Reset the upload state to allow creating a new post
      setUploadCopies([]);
    }, [])
  );

  const submitHandler = async () => {
    if (!uid) {
      alert("Please login first");
      return;
    }

    // Directly navigate to CustomPostOverlay (skipping CustomVerdictOverlay)
    // Images will be uploaded when creating the post
    navigation.navigate("CustomPostOverlay", {
      uid,
      uploadCopies,
    });
  };

  return (
    <SafeAreaView
      style={[
        theme
          ? [styles.bodyBGDark, styles.body]
          : [styles.bodyBGLight, styles.body],
      ]}
    >
      <ScrollView
        style={[
          styles.scroll,
          theme
            ? { backgroundColor: "#222831" }
            : { backgroundColor: "#F5F5F5" },
        ]}
      >
        <TitleAndSubtitleCard
          title="POST YOUR ANSWER"
          subtite="Share your handwritten answer to any question and get valuable feedback!"
        />
        <UserStats />
        <Card>
          <View style={styles.instructionContainer}>
            <CardTitle text="SHARE YOUR WORK" />
            <View style={styles.instructionTextContainer}>
              <DisclaimerText text="Post your own written answer and get it reviewed by others. Upload photos of your answer (up to 3 pages) - include the question on the first page followed by your answer." />
            </View>
          </View>

          <AddPhotosComponents
            isAnswerUploaded={false}
            uploadCopies={uploadCopies}
            setUploadCopies={setUploadCopies}
            navigation={navigation}
            isQuestionAvailable={true}
          />

          <PrimaryButton
            isActive={uploadCopies.length > 0}
            submitHandler={submitHandler}
            title="Submit"
          />
        </Card>
      </ScrollView>
      <FullScreenLoader visible={loaderVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  bodyBGDark: {
    backgroundColor: "#222831",
  },
  bodyBGLight: {
    backgroundColor: "#F5F5F5",
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  instructionContainer: {
    marginBottom: 24,
  },
  instructionTextContainer: {
    marginTop: 12,
  },
});

export default CustomAnswerScreen;
