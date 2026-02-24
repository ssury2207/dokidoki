import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TextLabel from "@/src/components/atoms/TextLabel";
import DisclaimerText from "@/src/components/atoms/DisclaimerText";
import NormalText from "@/src/components/atoms/NormalText";

interface AIEvaluationReportData {
  relevance_score: number;
  structure_score: number;
  content_depth_score: number;
  presentation_score: number;
  innovation_score: number;
  total_score: number;
  summary: string;
  detailed_feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function OverallScoreCard({
  data,
}: {
  data: AIEvaluationReportData;
}) {
  const isLight = useSelector((s: RootState) => s.theme.isLight);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 40) return "#00C853"; // 80%+ of 50
    if (score >= 30) return "#FFA726"; // 60%+ of 50
    return "#FF5252";
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
      ]}
    >
      <TextLabel text={"Overall Score"} />
      <View style={styles.scoreContainer}>
        <Text
          style={[styles.scoreText, { color: getScoreColor(data.total_score) }]}
        >
          {data.total_score}
        </Text>
        <Text
          style={[
            styles.scoreOutOf,
            { color: !isLight ? "#666666" : "#AAAAAA" },
          ]}
        >
          / 50
        </Text>
      </View>

      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
      >
        <NormalText
          text={
            showDetailedBreakdown
              ? "▲ Close Detailed Breakdown"
              : "▼ View Detailed Breakdown"
          }
        />
      </TouchableOpacity>

      {/* Detailed Breakdown */}
      {showDetailedBreakdown && (
        <View
          style={[
            styles.breakdownContainer,
            { backgroundColor: isLight ? "#2C2C2C" : "#F8F8F8" },
          ]}
        >
          <DisclaimerText
            text={`1. Relevance & Understanding: ${data.relevance_score}/10`}
          />
          <DisclaimerText
            text={`2. Structure & Organization: ${data.structure_score}/10`}
          />
          <DisclaimerText
            text={`3. Content Depth & Examples: ${data.content_depth_score}/10`}
          />
          <DisclaimerText
            text={`4. Presentation & Neatness: ${data.presentation_score}/10`}
          />
          <DisclaimerText
            text={`5. Innovation / Value Addition: ${data.innovation_score}/10`}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginVertical: 12,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: "700",
  },
  scoreOutOf: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 4,
  },
  toggleButton: {
    marginTop: 12,
  },
  breakdownContainer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
});
