import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import TextLabel from '../../atoms/TextLabel';
import NormalText from '../../atoms/NormalText';
import GreenCheckIcon from '../../atoms/GreenCheckIcon';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
const ProgressCard = () => {
  const navigation = useNavigation();
  const questionSolved = '10';
  const theme = useSelector((state: RootState) => state.theme.isLight);
  return (
    <View
      style={[styles.card, { backgroundColor: theme ? '#EEEEEE' : '#FFFFFF' }]}
    >
      <View style={styles.sectionFullWidth}>
        <TextLabel text="PROGRESS" />

        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <GreenCheckIcon />
            <NormalText text={` Solved Questions: ${questionSolved}`} />
          </View>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('PractisedQuestions')}
          >
            <Text style={styles.seeAllButtonText}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowCenter}>
          <View style={styles.emptyRow} />
        </View>
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
    shadowColor: '#FFFFFF',
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButton: {
    backgroundColor: '#00ADB5',
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },
  seeAllButtonText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
  },
  rowCenter: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  emptyRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
  },
});

export default ProgressCard;
