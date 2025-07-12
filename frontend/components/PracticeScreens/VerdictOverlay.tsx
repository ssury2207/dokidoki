// OverlayScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import CorrectVerdict from './components/CorrectVerdict';

type Props = {
  verdict: boolean;
};

const VerdictOverlay: React.FC<Props> = ({}) => {
  const verdict = true;
  return (
    <View style={styles.overlay}>
      <CorrectVerdict />
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
});

export default VerdictOverlay;
// OverlayScreen.tsx
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Title from '../atoms/Title';
import NormalText from '../atoms/NormalText';
import PrimaryButton from '../atoms/PrimaryButton';

export default function VerdictOverlay() {
  const navigation = useNavigation();

  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          width: '80%',
        }}
      >
        <Title title="Congratulations!!" />
        <NormalText text="Your answer is correct" />
        <NormalText text="You have earned +2 points" />
        <NormalText text="Your Streak is updated " />

        <PrimaryButton
          isActive={true}
          submitHandler={overlayButtonHandler}
          title="Review Detailed Answer"
        />
      </View>
    </View>
  );
}
