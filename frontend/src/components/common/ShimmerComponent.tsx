// ShimmerWrapper.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';

type Props = {
  visible: boolean; // when true, show children; when false, show shimmer
  borderRadius?: number;
  containerStyle?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
};

const ShimmerPlaceholder = ({
  visible,
  borderRadius = 8,
  containerStyle,
  children,
}: Props) => {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const anim = useRef(new Animated.Value(-1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loopRef.current = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    if (!visible) loopRef.current.start();
    return () => loopRef.current?.stop?.();
  }, [anim]);

  useEffect(() => {
    // pause animation when visible, resume when not
    if (visible) loopRef.current?.stop?.();
    else loopRef.current?.start?.();
  }, [visible]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!size || size.w !== width || size.h !== height)
      setSize({ w: width, h: height });
  };

  const bandWidth = Math.min(
    120,
    Math.max(60, Math.round((size?.w ?? 160) * 0.5))
  );
  const translateX = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-bandWidth, size?.w ?? 160],
  });

  return (
    <View
      style={[
        { borderRadius, overflow: 'hidden' },
        // When not visible, reserve space using measured size (or a small fallback)
        !visible && size
          ? { width: size.w, height: size.h, backgroundColor: '#e0e0e0' }
          : null,
        containerStyle,
      ]}
    >
      {!visible && size ? (
        <>
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
          >
            <View
              style={{
                width: bandWidth,
                height: '100%',
                backgroundColor: 'white',
                opacity: 0.3,
              }}
            />
          </Animated.View>
          {/* Keep children mounted but invisible so layout stays identical */}
          <View style={{ opacity: 0 }} onLayout={onLayout}>
            {children}
          </View>
        </>
      ) : (
        // While measuring (first render) or once visible, render children normally but capture size
        <View onLayout={onLayout}>{children}</View>
      )}
    </View>
  );
};

export default ShimmerPlaceholder;
