import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type Props = {
  text: string;
};

const CardTitle: React.FC<Props> = ({ text }) => {
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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  titleColorLight: {
    color: '#111',
  },
  titleColorDark: {
    color: '#FFF',
  },
});

export default CardTitle;
