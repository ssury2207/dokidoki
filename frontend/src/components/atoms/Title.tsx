import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';

type Props = {
  title:string,
};

const Title: React.FC<Props> = (props) => {
  return (
        <Text style={styles.title}>{props.title}</Text>
  );
};

const styles = StyleSheet.create({
  title:{
    color:'#108174',
    textAlign:'center',
    fontSize:24,
    fontWeight:'bold',
    marginVertical:8
  } 
});

export default Title;
