import { useState, useEffect, useRef, memo } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

type Props = {
  text: string;
  speed?: number; // ms per character
  style?: TextStyle | TextStyle[];
};

const TypewriterText = ({ text, speed = 50, style }: Props) => {
  const [displayed, setDisplayed] = useState('');
  const iRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // reset and clear any prior timer
    iRef.current = 0;
    setDisplayed('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const id = setInterval(() => {
      const i = iRef.current;
      setDisplayed(text.slice(0, i + 1)); // derive from source, never append
      iRef.current = i + 1;
      if (iRef.current >= text.length) {
        clearInterval(id);
        timerRef.current = null;
      }
    }, Math.max(16, speed)); // avoid too-fast intervals

    timerRef.current = id;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [text, speed]);

  return <Text style={[styles.typewriterText, style]}>{displayed}</Text>;
};

export default memo(TypewriterText);

const styles = StyleSheet.create({
  typewriterText: {
    fontSize: 16,
    fontFamily: 'monospace',
    padding: 10,
  },
});
