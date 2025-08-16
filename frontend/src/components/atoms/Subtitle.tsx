import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

type Props = {
  subtitle: string;
};

const Subtitle: React.FC<Props> = (props) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  return (
    <Text
      style={[
        theme
          ? [styles.subtitleColorDark, styles.subtitle]
          : [styles.subtitleColorLight, styles.subtitle],
      ]}
    >
      {props.subtitle}
    </Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'light',
    marginVertical: 8,
  },
  subtitleColorLight: {
    color: '#393E46',
  },
  subtitleColorDark: {
    color: '#CCCCCC',
  },
});

export default Subtitle;
