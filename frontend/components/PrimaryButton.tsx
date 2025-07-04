import { StyleSheet, TouchableOpacity, View, Text, Animated } from 'react-native';
import React from 'react';

type Props = {
  title: string;
  isActive:boolean
  submitHandler: () => void;
};

const PrimaryButton: React.FC<Props> = ({ title,isActive, submitHandler }) => {
  return (
    <TouchableOpacity style={[styles.button, {backgroundColor:isActive ? '#108174' : 'grey' }]} disabled={!isActive} onPress={submitHandler}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginVertical:15
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PrimaryButton;
