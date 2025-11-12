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

  useEffect(() => {
    getEvaluationStats();
    if (currentUserID !== authorID) {
      checkSubmissionExists();
    }
  }, [postID]);

  useEffect(() => {
    if (currentUserID === authorID) {
      setEvaluateButton(false);
      if (evaluationCount === 0) {
        setDisclaimer("Waiting for evaluation...");
      } else {
        setDisclaimer(
          `You received ${evaluationCount} evaluations from the community`
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

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: !theme ? "#FFFFFF" : "#393E46" },
      ]}
    >
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
});

export default PostDetailsEvaluationCard;
