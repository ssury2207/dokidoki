import { View, Text, StyleSheet } from 'react-native';
import CorrectVerdict from './components/CorrectVerdict';
import InCorrectVerdict from './components/InCorrectVerdict';
import { RouteProp } from '@react-navigation/native';
type Props = {
  verdict: boolean;
};

const VerdictOverlay: React.FC<Props> = ({ route }) => {
  const verdict = route.params;
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
