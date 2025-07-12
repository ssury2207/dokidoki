import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';

type Props = {
  text: string|number,
};

const TextLabel: React.FC<Props> = ({text}) => {
  return (
        <Text style={styles.label}> {text}  </Text>
  );
};

const styles = StyleSheet.create({
  label:{
    color:'#111',
    fontSize:16,
    fontWeight:'bold',
    marginVertical:8
  } 
});

export default TextLabel;
