import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TextLabel from "@/src/components/atoms/TextLabel";
import NormalText from "@/src/components/atoms/NormalText";

export default function DetailedAnalysisCard({
  analysis,
}: {
  analysis: string;
}) {
  const isLight = useSelector((s: RootState) => s.theme.isLight);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
      ]}
    >
      <TextLabel text={"Detailed Analysis"} />
      <NormalText text={analysis || ""} />
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
});
