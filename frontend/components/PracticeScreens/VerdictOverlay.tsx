// OverlayScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import CorrectVerdict from './components/CorrectVerdict';
import InCorrectVerdict from './components/IncorrectVerdict';

type Props = {
  verdict: boolean;
};

const VerdictOverlay: React.FC<Props> = ({}) => {
  const verdict = false;
  return (
    <View style={styles.overlay}>
      {verdict ? <CorrectVerdict /> : <InCorrectVerdict />}
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
