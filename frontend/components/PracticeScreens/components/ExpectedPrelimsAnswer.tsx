import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextLabel from "@/components/atoms/TextLabel";
import NormalText from "@/components/atoms/NormalText";

type Props = {
  actualOption: string;
  expectedOption: string;
  expectedAnswer: string;
};

const ExpectedPrelimsAnswer: React.FC<Props> = (props) => {
  return (
    <View style={styles.section}>
      <TextLabel text={`Your Option: ${props.actualOption}`} />
      <TextLabel text={`Correct Option: ${props.expectedOption}`} />
      <NormalText text={props.expectedAnswer} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default ExpectedPrelimsAnswer;
