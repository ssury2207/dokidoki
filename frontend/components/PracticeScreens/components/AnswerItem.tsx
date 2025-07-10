import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import NormalText from "@/components/atoms/NormalText";

type Props = {
  option: string;
  text: string;
};

const AnswerItem: React.FC<Props> = (props) => {
  return (
    <View style={styles.section}>
      <NormalText text={props.option} />
      <NormalText text={props.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

export default AnswerItem;
