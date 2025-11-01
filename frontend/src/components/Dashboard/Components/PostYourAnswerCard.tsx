import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CardTitle from '../../atoms/CardTitle';
import DisclaimerText from '../../atoms/DisclaimerText';
import PrimaryButton from '../../atoms/PrimaryButton';

interface PostYourAnswerCardProps {
  onPress?: () => void;
}

const PostYourAnswerCard: React.FC<PostYourAnswerCardProps> = ({ onPress }) => {
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
        <View style={styles.titleContainer}>
          <CardTitle text="POST YOUR ANSWER" />
        </View>

        <View style={styles.contentRow}>
          <View style={styles.descriptionContainer}>
            <DisclaimerText text="Have you written any answer today? Post your answer written to any question of your choice and get it reviewed by your peers." />
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Post Now"
              isActive={true}
              submitHandler={onPress || (() => {})}
            />
          </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionFullWidth: {
    width: '100%',
  },
  titleContainer: {
    marginBottom: 8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  descriptionContainer: {
    flex: 1,
  },
  buttonContainer: {
    minWidth: 120,
  },
});

export default PostYourAnswerCard;
