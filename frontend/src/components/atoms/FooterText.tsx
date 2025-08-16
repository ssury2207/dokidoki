import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
type Props = {
  text: string;
};

const FooterText: React.FC<Props> = ({ text }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <Text
      style={
        theme
          ? [styles.footerColorDark, styles.footer]
          : [styles.footerColorLight, styles.footer]
      }
    >
      {' '}
      {text}{' '}
    </Text>
  );
};

const styles = StyleSheet.create({
  footer: {
    fontSize: 14,
    fontWeight: 'regular',
    marginVertical: 8,
    textAlign: 'center',
  },
  footerColorLight: {
    color: '#111',
  },
  footerColorDark: {
    color: '#FFF',
  },
});

export default FooterText;
