import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DisclaimerText from "../../atoms/DisclaimerText";
import CardTitle from "../../atoms/CardTitle";
import PrimaryButton from "../../atoms/PrimaryButton";

interface ProgressCardProps {
  onPress?: () => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ onPress }) => {
  const navigation = useNavigation();
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      (navigation as any).navigate("PracticeSelect", {
        caseType: true,
      });
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme ? "#393E46" : "#FFFFFF",
          shadowColor: theme ? "#FFFFFF" : "#000",
        },
      ]}
    >
      <View style={styles.sectionFullWidth}>
        <CardTitle text="PREVIOUS QUESTIONS" />

        <View style={styles.contentRow}>
          <View style={styles.descriptionContainer}>
            <DisclaimerText text="Catch up on questions you skipped in your daily challenges" />
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="View"
              isActive={true}
              submitHandler={handlePress}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionFullWidth: {
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  descriptionContainer: {
    flex: 1,
  },
  buttonContainer: {
    minWidth: 80,
  },
});

export default ProgressCard;
