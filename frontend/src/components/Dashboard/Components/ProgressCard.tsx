import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import TextLabel from '../../atoms/TextLabel';
import NormalText from '../../atoms/NormalText';
import GreenCheckIcon from '../../atoms/GreenCheckIcon';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchArchivedQuestions, selectArchivedQuestions, selectArchivedQuestionsError, selectArchivedQuestionsLoading } from '@/store/slices/archivedQuestionsSlice';
import { getArchiveQuestions } from '@/src/api/fetchArchiveQuestions';


const ProgressCard = () => {
  const navigation = useNavigation();
  const questionSolved = '10';
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectArchivedQuestions);
  const isLoading = useSelector(selectArchivedQuestionsLoading);
  const error = useSelector(selectArchivedQuestionsError);

  useEffect(() => {
    dispatch(fetchArchivedQuestions());
  }, [dispatch]);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error fetching questions</Text>;
  
  return (
    <View
      style={[styles.card, { backgroundColor: theme ? '#EEEEEE' : '#FFFFFF' }]}
    >
      <View style={styles.sectionFullWidth}>
        <TextLabel text="PREVIOUS QUESTIONS" />

        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <GreenCheckIcon />
            <NormalText text={` All Questions: ${data.length}`} />
          </View>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => (navigation as any).navigate('PractisedQuestions', { data })}
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
