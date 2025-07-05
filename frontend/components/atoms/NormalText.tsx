import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';

type Props = {
  text: string,
};

const NormalText: React.FC<Props> = ({text}) => {
  return (
        <Text style={styles.title}> {text}  </Text>
  );
};

const styles = StyleSheet.create({
  title:{
    color:'#50555C',
    fontSize:16,
    fontWeight:'regular',
    marginVertical:8
  } 
});

export default NormalText;
