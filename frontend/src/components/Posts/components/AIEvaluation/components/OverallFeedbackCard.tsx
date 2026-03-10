import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import NormalText from "@/src/components/atoms/NormalText";
import TextLabel from "@/src/components/atoms/TextLabel";

export default function OverallFeedbackCard({ summary }: { summary: string }) {
  const isLight = useSelector((s: RootState) => s.theme.isLight);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
      ]}
    >
      <TextLabel text="Overall Feedback" />
      <NormalText text={summary || ""} />
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
});
