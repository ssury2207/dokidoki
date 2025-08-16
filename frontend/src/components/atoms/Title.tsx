import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type Props = {
  title: string;
};

const Title: React.FC<Props> = (props) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  return (
    <Text
      style={[
        theme
          ? [styles.titleColorDark, styles.title]
          : [styles.titleColorLight, styles.title],
      ]}
    >
      {props.title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  titleColorLight: {
    color: '#108174',
  },
  titleColorDark: {
    color: '#00ADB5',
  },
});

export default Title;
