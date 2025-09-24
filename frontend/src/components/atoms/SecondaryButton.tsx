import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Button,
} from "react-native";
import React from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import NormalText from "./NormalText";

type Props = {
  title: string;
  isActive: boolean;
  submitHandler: () => void;
};

const SecondaryButton: React.FC<Props> = ({
  title,
  isActive,
  submitHandler,
}) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isActive ? "#F5F5F5" : "grey",
        },
      ]}
      disabled={!isActive}
      onPress={submitHandler}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    marginVertical: 15,
    backgroundColor: "#F5F5F5",
  },
  buttonText: {
    color: "50555C",
    fontSize: 18,
    textAlign: "center",
  },
});

export default SecondaryButton;
