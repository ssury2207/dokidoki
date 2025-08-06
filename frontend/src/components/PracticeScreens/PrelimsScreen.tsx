import { StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import PrimaryButton from '../atoms/PrimaryButton';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpectedPrelimsAnswer from './components/ExpectedPrelimsAnswer';
import PrelimsQuestionSection from './components/PrelimsQuestionSection';
import { setSelectedOption } from '@/store/slices/optionSelectorSlice';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { selectDailyPrelimsQuestion } from '@/store/slices/prelimsQuestionSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

export default function PrelimsScreen({ navigation }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectDailyPrelimsQuestion);
  const selectedOption = useSelector(
    (state: RootState) => state.optionSelector.actionOption
  );

  const [buttonActive, setButtonActive] = useState(true);

  const submitHandler = () => {
    if (selectedOption == null) {
      alert('Please select a valid option');
    } else {
      const expectedOption = data.Answer;
      const expectedOptionIDX =
        expectedOption.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
      if (selectedOption == expectedOptionIDX) {
        alert('Success');
      } else alert('WRONG');
      // navigation.navigate('Overlay', result);
      // dispatch(setIsAttempted(true));
      // setShowAnswer(true);
      // navigation.navigate('Overlay');
      // setButtonActive(false);
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title="PRELIMS QUESTION"
          subtite="Select one correct option to keep streak alive and earn points!"
        />

        <UserStats />
        <Card>
          <PrelimsQuestionSection />
          <PrimaryButton
            isActive={buttonActive}
            submitHandler={submitHandler}
            title="Submit"
          />
          {data && (
            <ExpectedPrelimsAnswer
              actualOption={selectedOption == null ? '' : selectedOption}
              expectedOption={data.Answer}
              explainatation={data.Explanation}
            />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F0F3F6',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
});
