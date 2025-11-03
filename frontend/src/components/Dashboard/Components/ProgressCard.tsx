import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from 'expo-router';
import TextLabel from '../../atoms/TextLabel';
import NormalText from '../../atoms/NormalText';
import GreenCheckIcon from '../../atoms/GreenCheckIcon';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchArchivedQuestions,
  selectArchivedQuestions,
  selectArchivedQuestionsError,
  selectArchivedQuestionsLoading,
} from '@/store/slices/archivedQuestionsSlice';
import { getArchiveQuestions } from '@/src/api/fetchArchiveQuestions';
import ShimmerPlaceholder from '../../common/ShimmerComponent';

const ProgressCard = () => {
  const navigation = useNavigation();
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectArchivedQuestions);
  const isLoading = useSelector(selectArchivedQuestionsLoading);
  const error = useSelector(selectArchivedQuestionsError);

  useEffect(() => {
    dispatch(fetchArchivedQuestions());
  }, [dispatch]);

  // if (!isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error fetching questions</Text>;

  return (
    <View
      style={[styles.card, { backgroundColor: theme ? '#393E46' : '#FFFFFF' }]}
    >
      <View style={styles.sectionFullWidth}>
        <TextLabel text="PREVIOUS QUESTIONS" />
        <ShimmerPlaceholder visible={!isLoading}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <GreenCheckIcon />
              <NormalText text={` All Questions: ${data.length}`} />
            </View>
            <TouchableOpacity
              style={[
                styles.seeAllButton,
                { backgroundColor: theme ? '#00ADB5' : '#108174' },
              ]}
              onPress={() =>
                (navigation as any).navigate('PracticeSelect', {
                  caseType: true,
                })
              }
            >
              <Text style={styles.seeAllButtonText}>See All</Text>
            </TouchableOpacity>
          </View>
        </ShimmerPlaceholder>
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 80,
  },
  seeAllButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
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
