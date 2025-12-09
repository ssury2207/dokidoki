import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import PrimaryButton from "../atoms/PrimaryButton";
import EvaluationModal from "./components/EvaluationModal";
import EvaluationBreakdown from "./components/EvaluationBreakdown";
import EvaluationScoreWidget from "./components/EvaluationScoreWidget";
import TextLabel from "../atoms/TextLabel";
import { supabase } from "@/src/supabaseConfig";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/types/navigation";
import AIEvaluationLoader from "../common/AIEvaluationLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Nav = StackNavigationProp<RootStackParamList>;

interface PostDetailsEvaluationCardProps {
  postID: string;
  authorID: string;
  currentUserID: string;
}

const PostDetailsEvaluationCard: React.FC<PostDetailsEvaluationCardProps> = ({
  postID,
  authorID,
  currentUserID,
}) => {
  const navigation = useNavigation<Nav>();
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [evaluationCount, setEvaluationCount] = useState(0);
  const [hasUserEvaluated, setHasUserEvaluated] = useState(false);
  const [disclaimer, setDisclaimer] = useState("");
  const [evaluateButtonVisible, setEvaluateButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [evaluationStats, setEvaluationStats] = useState<{
    param1_avg: number;
    param2_avg: number;
    param3_avg: number;
    param4_avg: number;
    param5_avg: number;
    average_score: number;
  } | null>(null);

  // AI Evaluation states
  const [hasAIEvaluation, setHasAIEvaluation] = useState(false);
  const [isGeneratingAIEvaluation, setIsGeneratingAIEvaluation] = useState(false);

  const getEvaluationStats = async () => {
    try {
      const { data, error } = await supabase.rpc("get_evaluation_stats", {
        p_post_id: postID,
      });
      if (error) {
        alert(error.message);
        return;
      }
      if (data && data.length > 0) {
        const stats = data[0];
        setEvaluationCount(Number(stats.evaluation_count) || 0);
        setEvaluationStats({
          param1_avg: Number(stats.param1_avg) || 0,
          param2_avg: Number(stats.param2_avg) || 0,
          param3_avg: Number(stats.param3_avg) || 0,
          param4_avg: Number(stats.param4_avg) || 0,
          param5_avg: Number(stats.param5_avg) || 0,
          average_score: Number(stats.average_score) || 0,
        });
      }
    } catch (error) {
      alert(error);
    }
  };
  const checkSubmissionExists = async () => {
    try {
      const { count, error } = await supabase
        .from("evaluations")
        .select("*", { count: "exact" })
        .eq("post_id", postID)
        .eq("evaluator_id", currentUserID);
      if (error) {
        alert(error.message);
        return;
      }
      setHasUserEvaluated(count === 1);
    } catch (error) {
      alert(error);
    }
  };

  // Check if AI evaluation exists for this post
  const checkAIEvaluation = async () => {
    try {
      // For now, we'll use AsyncStorage to track AI evaluations
      // In production, this should be stored in the database
      const aiEvaluationKey = `ai_evaluation_${postID}`;
      const hasEvaluation = await AsyncStorage.getItem(aiEvaluationKey);
      setHasAIEvaluation(hasEvaluation === "true");
    } catch (error) {
      console.log("Error checking AI evaluation:", error);
      setHasAIEvaluation(false);
    }
  };

  useEffect(() => {
    getEvaluationStats();
    if (currentUserID !== authorID) {
      checkSubmissionExists();
    }
    // Check if AI evaluation exists (only for author)
    if (currentUserID === authorID) {
      checkAIEvaluation();
    }
  }, [postID, currentUserID, authorID]);

  useEffect(() => {
    if (currentUserID === authorID) {
      setEvaluateButton(false);
      if (evaluationCount === 0) {
        setDisclaimer("Community Evaluation: No reviews yet");
      } else {
        setDisclaimer(
          `Community Evaluation: ${evaluationCount} ${evaluationCount === 1 ? 'review' : 'reviews'} received`
        );
      }
    } else {
      if (evaluationCount === 0) {
        setDisclaimer("Be the first to evaluate this answer");
      } else {
        if (hasUserEvaluated) {
          setDisclaimer(`${evaluationCount} users have evaluated`);
        } else {
          setDisclaimer(
            `${evaluationCount} users have evaluated • Add your evaluation`
          );
        }
      }
      setEvaluateButton(!hasUserEvaluated);
    }
  }, [evaluationCount, hasUserEvaluated, currentUserID, authorID]);

  const handleAIEvaluation = async () => {
    if (hasAIEvaluation) {
      // If evaluation already exists, navigate to the report
      navigation.navigate("AIEvaluationReport", {
        postId: postID,
      });
    } else {
      // Generate new AI evaluation
      setIsGeneratingAIEvaluation(true);

      try {
        // Simulate AI evaluation generation (2-3 seconds)
        // In production, this will call your AI API
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Mark that AI evaluation has been generated
        const aiEvaluationKey = `ai_evaluation_${postID}`;
        await AsyncStorage.setItem(aiEvaluationKey, "true");
        setHasAIEvaluation(true);

        // Navigate to the report screen
        navigation.navigate("AIEvaluationReport", {
          postId: postID,
        });
      } catch (error) {
        console.log("Error generating AI evaluation:", error);
        alert("Failed to generate AI evaluation. Please try again.");
      } finally {
        setIsGeneratingAIEvaluation(false);
      }
    }
  };

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: !theme ? "#FFFFFF" : "#393E46" },
      ]}
    >
      {/* AI Evaluation Loader */}
      <AIEvaluationLoader visible={isGeneratingAIEvaluation} />

      <EvaluationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefresh={() => {
          getEvaluationStats();
          checkSubmissionExists();
        }}
        theme={theme}
        postID={postID}
        authorID={authorID}
        evaluatorID={currentUserID}
      />

      {/* AI Evaluation Button - Only visible for post author */}
      {currentUserID === authorID && (
        <>
          <PrimaryButton
            isActive={true}
            title={hasAIEvaluation ? "View AI Evaluation" : "Get AI Evaluation"}
            submitHandler={handleAIEvaluation}
          />
          <View style={styles.sectionDivider} />
        </>
      )}

      <TextLabel text={`${disclaimer}`} />
      {evaluationCount > 0 && evaluationStats ? (
        <EvaluationBreakdown
          theme={theme}
          evaluationCount={evaluationCount}
          param1Avg={evaluationStats.param1_avg}
          param2Avg={evaluationStats.param2_avg}
          param3Avg={evaluationStats.param3_avg}
          param4Avg={evaluationStats.param4_avg}
          param5Avg={evaluationStats.param5_avg}
          averageScore={evaluationStats.average_score}
        />
      ) : (
        <></>
      )}
      {evaluateButtonVisible ? (
        <PrimaryButton
          isActive={true}
          title="Evaluate"
          submitHandler={() => setModalVisible(true)}
        />
      ) : (
        <></>
      )}
      <EvaluationScoreWidget
        postID={postID}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 16,
  },
});

export default PostDetailsEvaluationCard;
