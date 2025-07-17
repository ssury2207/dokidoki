import { View } from 'react-native';
import Title from '../../atoms/Title';
import NormalText from '../../atoms/NormalText';
import PrimaryButton from '../../atoms/PrimaryButton';
// import GreenCheckIcon from "../../atoms/GreenCheckIcon";
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';

const CorrectVerdict = () => {
  const navigation = useNavigation();
  const streak = useSelector((state: RootState) => state.userProgress.streak);
  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.modal}>
      <Title title="Congratulations!!" />

      <View style={styles.row}>
        {/* <GreenCheckIcon /> */}
        <NormalText text="Your answer is correct" />
      </View>
      <View style={styles.row}>
        {/* <GreenCheckIcon /> */}
        <NormalText text="You have earned +2 points" />
      </View>

      <NormalText text={`Current Streak ${streak} Days `} />

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
