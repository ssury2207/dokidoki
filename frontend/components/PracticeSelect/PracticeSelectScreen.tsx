import React from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';

export default function PracticeSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World from Practice Select Screen!</Text>
      <Button
              title="Mains"
              onPress={() => navigation.navigate('MainsScreen')}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                  
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: '#fff',  
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
