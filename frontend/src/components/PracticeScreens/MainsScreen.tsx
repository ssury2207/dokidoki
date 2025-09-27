import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import MainsQuestionCard from "../common/MainsQuestionCard";
import AddPhotosComponents from "../common/AddPhotosComponent";
import PrimaryButton from "../atoms/PrimaryButton";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import UserStats from "../common/UserStats";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalText from "../atoms/NormalText";
import { fetchTodaysQuestion } from "@/src/api/dailyMainsQuestion";
import { getFirestore } from "firebase/firestore";
import { auth } from "@/src/firebaseConfig";
import FullScreenLoader from "../common/FullScreenLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { checkSubmissions } from "@/src/api/checkTodaysSubmissions";
import { RootStackParamList } from "@/src/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ShareButton from "../common/ShareButton";
import DisclaimerText from "../atoms/DisclaimerText";
import Subtitle from "../atoms/Subtitle";
import TextLabel from "../atoms/TextLabel";
type MainsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MainsScreen"
>;

const MainsScreen = ({ navigation, route }: MainsScreenProps) => {
  const date = route.params?.date;
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const [loaderVisible, setLoaderVisible] = useState(false);
  const [isAnswerCopiesDateExists, setIsAnswerCopiesDateExists] =
    useState<boolean>(false);
  const [todaysAnswerCopies, setTodaysAnswerCopies] = useState<string[]>([]);
  const [uploadCopies, setUploadCopies] = useState<
    { id: number; uri: string }[]
  >([]);
  const [prelimsubmissionData, setPrelimSubmissionData] = useState<{
    id: string;
  } | null>(null);
  const [mainssubmissionData, setMainsSubmissionData] = useState<{
    id: string;
  } | null>(null);

  const db = getFirestore();
  const today = date || new Date().toISOString().substring(0, 10);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchTodaysQuestion(today)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoaderVisible(true);
    setLoading(true); // match neutral UI on screen entry

    const checkDate = async () => {
      try {
        if (!uid) {
          if (!cancelled) {
            setPrelimSubmissionData(null);
            setMainsSubmissionData(null);
            setIsAnswerCopiesDateExists(false);
            setTodaysAnswerCopies([]);
          }
          return;
        }

        const { pre_submitted_data, mains_submitted_data } =
          await checkSubmissions(today);

        if (cancelled) return;

        // handle prelim data
        setPrelimSubmissionData(pre_submitted_data ?? null);

        // handle mains data and guard access
        if (mains_submitted_data) {
          setMainsSubmissionData(mains_submitted_data);
          setIsAnswerCopiesDateExists(true);
          setTodaysAnswerCopies(mains_submitted_data.submission_uri || []);
        } else {
          setMainsSubmissionData(null);
          setIsAnswerCopiesDateExists(false);
          setTodaysAnswerCopies([]);
        }
      } catch (e) {
        if (!cancelled) {
          console.log("checkTodaysSubmissions failed:", e);
          setPrelimSubmissionData(null);
          setMainsSubmissionData(null);
          setIsAnswerCopiesDateExists(false);
          setTodaysAnswerCopies([]);
        }
      } finally {
        if (!cancelled) {
          setLoaderVisible(false);
          setLoading(false);
        }
      }
    };

    checkDate();
    return () => {
      cancelled = true;
    };
  }, [uid, db, today]);

  const submitHandler = async () => {
    const prelims_solved = prelimsubmissionData != null;
    const mains_solved = mainssubmissionData != null;

    navigation.navigate("MainsVerdictOverlay", {
      uid,
      uploadCopies,
      prelims_solved,
      mains_solved,
      data,
      date: today,
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
          title="MAINS QUESTION"
          subtite="Upload your handwritten answer to keep the streak alive!"
        />
        <UserStats />
        <Card>
          <MainsQuestionCard fakeData={data} />

          <AddPhotosComponents
            isAnswerUploaded={isAnswerCopiesDateExists}
            uploadCopies={uploadCopies}
            setUploadCopies={setUploadCopies}
            navigation={navigation}
          />
          {isAnswerCopiesDateExists &&
            todaysAnswerCopies.map((url, idx) => (
              <View key={idx} style={styles.fileItem}>
                <Text style={styles.fileText}>{idx}.jpg</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("FullScreenImageViewer", {
                      imageUrl: url,
                    })
                  }
                >
                  <Image
                    source={{ uri: url }}
                    style={{ height: 50, width: 50 }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          {isAnswerCopiesDateExists ? (
            <NormalText text={`Thank you for writing an answer today`} />
          ) : (
            <></>
          )}

          {data != null ? <ShareButton question={data.Question} /> : <></>}

          {!isAnswerCopiesDateExists ? (
            <PrimaryButton
              isActive={uploadCopies.length > 0}
              submitHandler={submitHandler}
              title="Submit"
            />
          ) : (
            <>
              <PrimaryButton
                isActive={true}
                submitHandler={() =>
                  navigation.navigate("CreatePostOverlay", {
                    images: todaysAnswerCopies,
                    question: data?.Question,
                    year: data?.Year?.toString(),
                    paper: data?.Paper,
                  })
                }
                title="Create Post"
              />
              <DisclaimerText text="Create a post to share and get feedback" />
            </>
          )}
        </Card>
      </ScrollView>
      <FullScreenLoader visible={loaderVisible || loading} />
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

export default MainsScreen;
