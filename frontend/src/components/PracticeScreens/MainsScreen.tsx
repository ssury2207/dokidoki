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
import FixedImageCarousel from "../common/FixedImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalText from "../atoms/NormalText";
import { fetchTodaysQuestion } from "@/src/api/dailyMainsQuestion";
import { supabase } from "@/src/supabaseConfig";
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
import { getCloudinaryThumbnail } from "@/src/utils/imageUtils";
import { useFocusEffect } from "@react-navigation/native";
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
  const [userPostId, setUserPostId] = useState<string | null>(null);
  const [checkingPost, setCheckingPost] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  const today = date || new Date().toISOString().substring(0, 10);

  // Get current user ID from Supabase
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUid(user?.id || null);
    };
    getUserId();
  }, []);

  useEffect(() => {
    fetchTodaysQuestion(today)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  // Function to check if user has created a post for this question
  const checkUserPost = async () => {
    if (!uid || !data?.id) {
      setUserPostId(null);
      return;
    }

    setCheckingPost(true);
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', uid)
        .eq('question_id', data.id)
        .limit(1);

      if (error) {
        console.log("Error checking user post:", error);
        setUserPostId(null);
        return;
      }

      if (posts && posts.length > 0) {
        // User has created a post for this question
        setUserPostId(posts[0].id);
      } else {
        setUserPostId(null);
      }
    } catch (error) {
      console.log("Error checking user post:", error);
      setUserPostId(null);
    } finally {
      setCheckingPost(false);
    }
  };


  // Function to check submissions (extracted for reuse)
  const checkSubmissionStatus = async () => {
    setLoaderVisible(true);
    setLoading(true);

    try {
      if (!uid) {
        setPrelimSubmissionData(null);
        setMainsSubmissionData(null);
        setIsAnswerCopiesDateExists(false);
        setTodaysAnswerCopies([]);
        setUploadCopies([]); // Clear upload state
        return;
      }

      const { pre_submitted_data, mains_submitted_data } =
        await checkSubmissions(today);

      // handle prelim data
      setPrelimSubmissionData(pre_submitted_data ?? null);

      // handle mains data and guard access
      if (mains_submitted_data) {
        setMainsSubmissionData(mains_submitted_data);
        setIsAnswerCopiesDateExists(true);
        setTodaysAnswerCopies(mains_submitted_data.submission_uri || []);
        setUploadCopies([]); // Clear upload state when submission exists
      } else {
        setMainsSubmissionData(null);
        setIsAnswerCopiesDateExists(false);
        setTodaysAnswerCopies([]);
      }
    } catch (e) {
      console.log("checkTodaysSubmissions failed:", e);
      setPrelimSubmissionData(null);
      setMainsSubmissionData(null);
      setIsAnswerCopiesDateExists(false);
      setTodaysAnswerCopies([]);
    } finally {
      setLoaderVisible(false);
      setLoading(false);
    }
  };

  // Initial check on mount
  useEffect(() => {
    let cancelled = false;

    const checkDate = async () => {
      if (!cancelled) {
        await checkSubmissionStatus();
      }
    };

    checkDate();
    return () => {
      cancelled = true;
    };
  }, [uid, today]);

  // Refresh submission status and check for user's post when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const refreshScreen = async () => {
        // Always refresh to show correct submission status
        await checkSubmissionStatus();
        if (data?.id) {
          await checkUserPost();
        }
      };
      refreshScreen();
    }, [uid, today, data?.id])
  );

  const submitHandler = async () => {
    if (!uid) {
      alert("Please login first");
      return;
    }

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
            isQuestionAvailable={data != null}
          />
          {isAnswerCopiesDateExists && todaysAnswerCopies.length > 0 && (
            <FixedImageCarousel
              images={todaysAnswerCopies}
              onImagePress={(imageUrl, imageIndex) =>
                navigation.navigate("FullScreenImageViewer", {
                  images: todaysAnswerCopies,
                  initialIndex: imageIndex,
                })
              }
            />
          )}
          {isAnswerCopiesDateExists ? (
            <NormalText text={`Thank you for writing an answer today`} />
          ) : (
            <></>
          )}

          {data != null ? <ShareButton question={data.Question} /> : <></>}

          {!isAnswerCopiesDateExists ? (
            <>
              <View style={styles.aiEvaluationInfoBox}>
                <Text style={[styles.aiEvaluationInfoText, { color: theme ? "#00ADB5" : "#00ADB5" }]}>
                  Post your answer to unlock AI-powered evaluation!
                </Text>
              </View>
              <PrimaryButton
                isActive={uploadCopies.length > 0}
                submitHandler={submitHandler}
                title="Submit"
              />
            </>
          ) : (
            <>
              {userPostId ? (
                <>
                  <PrimaryButton
                    isActive={true}
                    submitHandler={() =>
                      navigation.navigate("PostDetail", { postId: userPostId })
                    }
                    title="See Your Post"
                  />
                  <DisclaimerText text="View your post and check reviews" />
                </>
              ) : (
                <>
                  <View style={styles.aiEvaluationInfoBox}>
                    <Text style={[styles.aiEvaluationInfoText, { color: theme ? "#00ADB5" : "#00ADB5" }]}>
                      Post your answer to unlock AI-powered evaluation!
                    </Text>
                  </View>
                  <PrimaryButton
                    isActive={true}
                    submitHandler={() =>
                      navigation.navigate("CreatePostOverlay", {
                        images: todaysAnswerCopies,
                        question: data?.Question,
                        year: data?.Year?.toString(),
                        paper: data?.Paper,
                        questionId: data?.id,
                      })
                    }
                    title="Create Post"
                  />
                  <DisclaimerText text="Create a post to share and get feedback" />
                </>
              )}
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
  aiEvaluationInfoBox: {
    backgroundColor: "rgba(0, 173, 181, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 173, 181, 0.3)",
  },
  aiEvaluationInfoText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default MainsScreen;
