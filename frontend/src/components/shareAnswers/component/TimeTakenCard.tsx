import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NormalText from "../../atoms/NormalText";
import DisclaimerText from "../../atoms/DisclaimerText";

interface TimeTakenCardProp {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  theme: boolean;
}

const TimeTakenCard: React.FC<TimeTakenCardProp> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  theme,
}) => {
  return (
    <View>
      <View style={styles.parameterRow}>
        <View style={styles.labelColumn}>
          <DisclaimerText text={label} />
        </View>
        <View style={styles.stepperGroup}>
          <TouchableOpacity
            style={[
              styles.stepperButton,
              {
                backgroundColor:
                  value === 0 ? (theme ? "#555" : "#DDD") : "#00ADB5",
                opacity: value === 0 ? 0.5 : 1,
              },
            ]}
            onPress={onDecrement}
            disabled={value === 0}
          >
            <Text style={styles.stepperText}>-</Text>
          </TouchableOpacity>

          <Text style={[styles.valueText, { color: theme ? "#EEE" : "#000" }]}>
            {value}
          </Text>

          <TouchableOpacity
            style={[
              styles.stepperButton,
              {
                backgroundColor:
                  value === 15 ? (theme ? "#555" : "#DDD") : "#00ADB5",
                opacity: value === 15 ? 0.5 : 1,
              },
            ]}
            onPress={onIncrement}
            disabled={value === 15}
          >
            <Text style={styles.stepperText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      {value === 15 ? (
        <DisclaimerText
          text={
            "15 min limit: Average time is 7 min for 10 marks, 11 min for 15 marks, try to improve on speed."
          }
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parameterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  labelColumn: {
    flex: 1,
    marginRight: 12,
  },
  stepperGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
});

export default TimeTakenCard;
