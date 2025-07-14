import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';

type Props = {
  text: string,
};

const FooterText: React.FC<Props> = ({text}) => {
  return (
        <Text style={styles.footer}> {text}  </Text>
  );
};

const styles = StyleSheet.create({
  footer:{
    color:'black',
    fontSize:14,
    fontWeight:'regular',
    marginVertical:8,
    textAlign:'center'    
  } 
});

export default FooterText;
