import { View } from 'react-native';
import Title from '../../atoms/Title';
import NormalText from '../../atoms/NormalText';
import PrimaryButton from '../../atoms/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
// import RedCrossIcon from "../../atoms/RedCrossIcon";

const InCorrectVerdict = () => {
  const navigation = useNavigation();
  const streak = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  return (
    <View
      style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
    >
      <Title title="Opps !!" />

      <View style={styles.row}>
        {/* <RedCrossIcon /> */}
        <NormalText text="Your answer was incorrect" />
      </View>
      <View style={styles.row}>
        {/* <RedCrossIcon /> */}
        <NormalText text="Try again tomorrow to gain Points" />
      </View>

      <View style={styles.row}>
        <NormalText text={`Current Streak ${streak} Days `} />
      </View>
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
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalBGLight: {
    backgroundColor: 'white',
  },
  modalBGDark: {
    backgroundColor: '#222831',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default InCorrectVerdict;
