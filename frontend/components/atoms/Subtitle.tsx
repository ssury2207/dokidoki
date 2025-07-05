import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';

type Props = {
  subtitle:string,
};

const Subtitle: React.FC<Props> = (props) => {
  return (
        <Text style={styles.subtitle}>{props.subtitle}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle:{
    color:'#50555C',
    textAlign:'center',
    fontSize:18,
    fontWeight:'light',
    marginVertical:8
  }
});

export default Subtitle;
