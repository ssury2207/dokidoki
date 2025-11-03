import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import TextLabel from '../../atoms/TextLabel';
import NormalText from '../../atoms/NormalText';
import DisclaimerText from '../../atoms/DisclaimerText';
import SubtleButton from '../../atoms/SubtleButton';
import Subtitle from '../../atoms/Subtitle';
import FooterText from '../../atoms/FooterText';
import CardTitle from '../../atoms/CardTitle';
import PrimaryButton from '../../atoms/PrimaryButton';

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
        <CardTitle text="COMMUNITY POSTS" />

        <View style={styles.contentRow}>
          <View style={styles.descriptionContainer}>
            <DisclaimerText text="Learn from others, share your insights, and refine your writing through feedback" />
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="View"
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
    minWidth: 80,
  },
});

export default OthersAnswersCard;
