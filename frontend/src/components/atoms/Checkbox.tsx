import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import NormalText from "./NormalText";

interface CheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onToggle, label }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View
        style={[
          styles.checkbox,
          isChecked ? styles.checked : styles.unchecked,
          theme ? styles.checkboxBorderDark : styles.checkboxBorderLight,
        ]}
      >
        {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <NormalText text={label} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#108174",
  },
  unchecked: {
    backgroundColor: "transparent",
  },
  checkboxBorderDark: {
    borderColor: "#108174",
  },
  checkboxBorderLight: {
    borderColor: "#108174",
  },
});

export default Checkbox;
