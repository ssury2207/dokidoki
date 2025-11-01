import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface FeedbackCardProps {
  onPress?: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ onPress }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme ? '#393E46' : '#FFFFFF',
          shadowColor: theme ? '#FFFFFF' : '#000',
          borderColor: theme ? '#00ADB5' : '#FF8358',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[
          styles.title,
          { color: theme ? '#00ADB5' : '#FF8358' }
        ]}>
          We'd love to hear from you!
        </Text>
        <Text style={[
          styles.description,
          { color: theme ? '#EEEEEE' : '#50555C' }
        ]}>
          Share your honest feedback, suggest new features, or report any bugs. Your input helps us improve.
        </Text>
        <Text style={[
          styles.hint,
          { color: theme ? '#00ADB5' : '#FF8358' }
        ]}>
          👆 Tap here to send us a message
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>💬</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 2,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
  },
});

export default FeedbackCard;
