import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Button,
} from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type Props = {
  title: string;
  isActive: boolean;
  submitHandler: () => void;
};

const PrimaryButton: React.FC<Props> = ({ title, isActive, submitHandler }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isActive ? (theme ? '#00ADB5' : '#108174') : 'grey',
        },
      ]}
      disabled={!isActive}
      onPress={submitHandler}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    marginVertical: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PrimaryButton;
