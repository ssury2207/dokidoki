import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TextLabel from "@/src/components/atoms/TextLabel";
import DisclaimerText from "@/src/components/atoms/DisclaimerText";

export default function ImprovementsCard({
  improvements,
}: {
  improvements: string[];
}) {
  const isLight = useSelector((s: RootState) => s.theme.isLight);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: !isLight ? "#FFFFFF" : "#393E46" },
      ]}
    >
      <TextLabel text={"Areas for Improvement ✓"} />

      {improvements?.map((improvement, index) => (
        <View key={index} style={styles.listItem}>
          <View style={[styles.bulletPoint, { backgroundColor: "#FFA726" }]} />
          <DisclaimerText text={improvement} />
        </View>
      ))}
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
});
