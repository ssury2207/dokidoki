// OverlayScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Title from '../atoms/Title';
import NormalText from '../atoms/NormalText';
import PrimaryButton from '../atoms/PrimaryButton';
type Props = {
  verdict: boolean;
};

const MainsVerdictOverlay: React.FC<Props> = ({}) => {
  const navigation = useNavigation();

  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Title title="Preparing Your Report" />

        <View style={styles.row}>
          <NormalText text="You will be notified once the report is finished" />
        </View>
        <View style={styles.row}>
          <NormalText text="Your streak is alive" />
        </View>

        <PrimaryButton
          isActive={true}
          submitHandler={overlayButtonHandler}
          title="Review Detailed Answer"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default MainsVerdictOverlay;
