import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type Props = {
  text: string;
};

const NormalText: React.FC<Props> = ({ text }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <Text
      style={
        theme
          ? [styles.titleColorDark, styles.title]
          : [styles.titleColorLight, styles.title]
      }
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'regular',
    marginVertical: 8,
  },
  titleColorLight: {
    color: '#50555C',
  },
  titleColorDark: {
    color: '#CCCC',
  },
});

export default NormalText;
