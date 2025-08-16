import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
type Props = {
  children?: React.ReactNode;
};

const Card: React.FC<Props> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <View
      style={[
        styles.cardContainer,
        theme
          ? [styles.cardBGDark, styles.cardShadowDark]
          : [styles.cardBGLight, styles.cardShadowDark],
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    marginBottom: 24,
  },
  cardBGLight: {
    backgroundColor: '#FFFF',
  },
  cardBGDark: {
    backgroundColor: '#393E46',
  },
  cardShadowLight: {
    shadowColor: '#000',
  },
  cardShadowDark: {
    shadowColor: '#FFFFFF',
  },
});

export default Card;
