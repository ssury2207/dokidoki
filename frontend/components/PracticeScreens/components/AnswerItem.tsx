import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import NormalText from "@/components/atoms/NormalText";

type Props = {
  option: string;
  text: string;
};

const AnswerItem: React.FC<Props> = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const buttonItemSelector = (isactive: boolean) => {
    setIsSelected((isactive) => !isactive);
  };
  return (
    <TouchableOpacity
      onPress={() => buttonItemSelector(isSelected)}
      style={[styles.section, isSelected ? styles.selected : styles.unselected]}
    >
      <NormalText text={props.option} />
      <NormalText text={props.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 4,
  },
  selected: {
    backgroundColor: "#CBDFE1",
    borderColor: "#37B9C5",
  },
  unselected: {
    backgroundColor: "#F0F3F6",
    borderColor: "#50555C",
  },
});

export default AnswerItem;
