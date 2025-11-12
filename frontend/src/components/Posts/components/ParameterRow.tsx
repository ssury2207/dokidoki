import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NormalText from "../../atoms/NormalText";

interface ParameterRowProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  theme: boolean;
}

const ParameterRow: React.FC<ParameterRowProps> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  theme,
}) => {
  return (
    <View style={styles.parameterRow}>
      <View style={styles.labelColumn}>
        <NormalText text={label} />
      </View>
      <View style={styles.stepperGroup}>
        <TouchableOpacity
          style={[
            styles.stepperButton,
            {
              backgroundColor: value === 0 ? (theme ? "#555" : "#DDD") : "#00ADB5",
              opacity: value === 0 ? 0.5 : 1,
            },
          ]}
          onPress={onDecrement}
          disabled={value === 0}
        >
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.valueText,
            { color: theme ? "#EEE" : "#000" },
          ]}
        >
          {value}
        </Text>

        <TouchableOpacity
          style={[
            styles.stepperButton,
            {
              backgroundColor: value === 10 ? (theme ? "#555" : "#DDD") : "#00ADB5",
              opacity: value === 10 ? 0.5 : 1,
            },
          ]}
          onPress={onIncrement}
          disabled={value === 10}
        >
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>

        <NormalText text="/10" />
      </View>
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
    width: 36,
    height: 36,
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
    fontSize: 18,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },
});

export default ParameterRow;
