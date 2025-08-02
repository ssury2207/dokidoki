import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ShimmerPlaceholder = () => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Base gray background */}
      <View style={styles.background} />

      {/* Shimmer animated white-to-transparent band */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      >
        <View style={styles.shimmerGradient} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  background: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100, // width of the shimmer band
  },
  shimmerGradient: {
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.3,
    borderRadius: 4,
  },
});

export default ShimmerPlaceholder;
