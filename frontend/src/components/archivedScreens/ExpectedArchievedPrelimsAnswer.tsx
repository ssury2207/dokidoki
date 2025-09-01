import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TextLabel from '@/src/components/atoms/TextLabel';
import NormalText from '@/src/components/atoms/NormalText';

type Props = {
  actualOption: string;
  expectedOption: string;
  explainatation: string;
  verdict: string;
};

const ExpectedArchievedPrelimsAnswer: React.FC<Props> = (props) => {
  return (
    <View style={styles.section}>
      <TextLabel
        text={`Your Option: ${props.actualOption} is ${props.verdict}`}
      />
      <TextLabel text={`Correct Option: ${props.expectedOption}`} />
      <NormalText text={props.explainatation} />
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

export default ExpectedArchievedPrelimsAnswer;
