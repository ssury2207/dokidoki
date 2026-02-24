import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TextLabel from "@/src/components/atoms/TextLabel";
import NormalText from "@/src/components/atoms/NormalText";
import PrimaryButton from "@/src/components/atoms/PrimaryButton";

interface AIEvaluationErrorCardProps {
  errorType: "validation" | "technical";
  errorMessage: string;
  onGoBack: () => void;
}

export default function AIEvaluationErrorCard({
  errorType,
  errorMessage,
  onGoBack,
}: AIEvaluationErrorCardProps) {
  const isLight = useSelector((s: RootState) => s.theme.isLight);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: !isLight ? "#FFF4E6" : "#2D2520",
          borderColor: !isLight ? "#FF9800" : "#FFA726",
        },
      ]}
    >
      <TextLabel
        text={errorType === "validation" ? "Validation Error" : "Service Error"}
      />
      <NormalText text={errorMessage} />
      <PrimaryButton isActive={true} title="Go Back" submitHandler={onGoBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
