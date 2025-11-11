import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { supabase } from "@/src/supabaseConfig";
import DisclaimerText from "../../atoms/DisclaimerText";

interface EvaluationScoreWidgetProps {
  postID: string;
  theme: boolean;
}

const EvaluationScoreWidget: React.FC<EvaluationScoreWidgetProps> = ({
  postID,
  theme,
}) => {
  const [evaluationCount, setEvaluationCount] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc("get_evaluation_stats", {
          p_post_id: postID,
        });
        if (!error && data && data.length > 0) {
          const stats = data[0];
          setEvaluationCount(Number(stats.evaluation_count) || 0);
          setAverageScore(Number(stats.average_score) || 0);
        }
      } catch (error) {
        console.error("Error fetching evaluation stats:", error);
      }
    };
    fetchStats();
  }, [postID]);

  return (
    <View style={styles.container}>
      <DisclaimerText
        text={
          evaluationCount > 0
            ? `Total Score: ${averageScore.toFixed(1)}/50`
            : "Waiting for evaluation..."
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

export default EvaluationScoreWidget;
