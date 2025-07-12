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
