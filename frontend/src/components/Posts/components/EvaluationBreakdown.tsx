import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import NormalText from "../../atoms/NormalText";
import TextLabel from "../../atoms/TextLabel";
import DisclaimerText from "../../atoms/DisclaimerText";

interface EvaluationBreakdownProps {
  theme: boolean;
  evaluationCount: number;
  param1Avg: number;
  param2Avg: number;
  param3Avg: number;
  param4Avg: number;
  param5Avg: number;
  averageScore: number;
}

const EvaluationBreakdown: React.FC<EvaluationBreakdownProps> = ({
  theme,
  evaluationCount,
  param1Avg,
  param2Avg,
  param3Avg,
  param4Avg,
  param5Avg,
  averageScore,
}) => {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
      >
        <NormalText
          text={
            showDetailedBreakdown
              ? "▲ Close Detailed Breakdown"
              : `▼ View Detailed Breakdown`
          }
        />
      </TouchableOpacity>
      {showDetailedBreakdown && (
        <View
          style={[
            styles.breakdownContainer,
            { backgroundColor: theme ? "#2C2C2C" : "#F8F8F8" },
          ]}
        >
          <TextLabel text={`1. Relevance & Understanding ${param1Avg.toFixed(1)}/10`} />
          <TextLabel text={`2. Structure & Organization ${param2Avg.toFixed(1)}/10`} />
          <TextLabel text={`3. Content Depth & Examples ${param3Avg.toFixed(1)}/10`} />
          <TextLabel text={`4. Presentation & Neatness ${param4Avg.toFixed(1)}/10`} />
          <TextLabel text={`5. Innovation / Value Addition ${param5Avg.toFixed(1)}/10`} />
          <DisclaimerText text={`Total Score: ${averageScore.toFixed(1)}/50`} />
          <DisclaimerText
            text={`\n*Each score is averaged from ${evaluationCount} evaluations`}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    // marginVertical: 8,
  },
  breakdownContainer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
});

export default EvaluationBreakdown;
