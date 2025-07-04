import {  StyleSheet,  TouchableOpacity } from 'react-native';
import { View,Text ,Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';

type Props ={
    title:string,
    description: string
    buttonHandler :()=> void
}

const CardButton: React.FC<Props> = (props) => {
  const translateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -2, // move slightly up
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0, // back to original position
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);


  return (
    <Animated.View
        style={{
          transform: [{ translateY }],
          flexDirection: 'row',
          backgroundColor: '#E8D8D8',
          borderWidth:1,
          borderColor:'#FF5A5A',
          justifyContent: 'space-evenly',
          borderRadius: 15,
          padding: 10,
        }}
      >
        <View style={{ flex: 3, padding: 2 }}>
        <TouchableOpacity onPress={props.buttonHandler}>
        <Text style={{ fontWeight: '600', color: 'black', fontSize: 16 }}>{props.title}</Text>
          <Text style={{ fontWeight: '200', color: 'black', fontSize: 12 }}>
            {props.description}
          </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
  );
}
 
export default CardButton;