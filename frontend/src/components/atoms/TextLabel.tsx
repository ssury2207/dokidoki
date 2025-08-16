import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
type Props = {
  text: string | number;
};

const TextLabel: React.FC<Props> = ({ text }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <Text
      style={
        theme
          ? [styles.lableColorDark, styles.label]
          : [styles.lableColorLight, styles.label]
      }
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  lableColorLight: {
    color: '#111',
  },
  lableColorDark: {
    color: '#FFF',
  },
});

export default TextLabel;
