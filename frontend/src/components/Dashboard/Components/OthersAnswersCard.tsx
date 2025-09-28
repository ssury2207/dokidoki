import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface OthersAnswersCardProps {
  onPress?: () => void;
}

const OthersAnswersCard: React.FC<OthersAnswersCardProps> = ({ onPress }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme ? '#393E46' : '#FFFFFF',
          shadowColor: theme ? '#FFFFFF' : '#000',
        },
      ]}
    >
      <View style={styles.sectionFullWidth}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme ? '#EEEEEE' : '#000000' },
          ]}
        >
          CHECK OUT OTHER'S ANSWERS
        </Text>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onPress}
        >
          <Text style={styles.seeAllButtonText}>
            Check out Other's answers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionFullWidth: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'left',
  },
  seeAllButton: {
    backgroundColor: '#00ADB5',
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 16,
    width: '100%',
  },
  seeAllButtonText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
  },
});

export default OthersAnswersCard;
