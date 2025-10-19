import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import DisclaimerText from '../../atoms/DisclaimerText';
import BellLightIcon from '../../atoms/BellLightIcon';
import BellDarkIcon from '../../atoms/BellDarkIcon';

interface NotificationCardProps {
  onPress?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ onPress }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme ? '#393E46' : '#FFFFFF',
          shadowColor: theme ? '#FFFFFF' : '#000',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <DisclaimerText text="Always stay updated and never miss daily challenge, click the bell icon" />
      </View>
      <View style={styles.iconContainer}>
        {theme ? <BellLightIcon /> : <BellDarkIcon />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationCard;
