// OverlayScreen.tsx
import { View } from 'react-native';
import Title from '@/components/atoms/Title';
import NormalText from '@/components/atoms/NormalText';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import GreenCheckIcon from '@/components/atoms/GreenCheck';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet } from 'react-native';

const CorrectVerdict = () => {
  const navigation = useNavigation();

  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.modal}>
      <Title title="Congratulations!!" />

      <View style={styles.row}>
        <GreenCheckIcon />
        <NormalText text="Your answer is correct" />
      </View>
      <View style={styles.row}>
        <GreenCheckIcon />
        <NormalText text="You have earned +2 points" />
      </View>

      <NormalText text={`Current Streak ${2} Days `} />

      <View style={styles.row}></View>
      <PrimaryButton
        isActive={true}
        submitHandler={overlayButtonHandler}
        title="Review Detailed Answer"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default CorrectVerdict;
