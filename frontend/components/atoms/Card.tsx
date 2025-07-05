import { StyleSheet,Text,  View,  } from 'react-native';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

const Card: React.FC<Props> = ({children}) => {
  return (
    <View style={styles.cardContainer}>
         {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    marginBottom:24
  }
   
});

export default Card;
