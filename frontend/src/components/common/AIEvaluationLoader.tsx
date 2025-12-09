import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AIEvaluationLoaderProps {
  visible: boolean;
}

const AIEvaluationLoader: React.FC<AIEvaluationLoaderProps> = ({ visible }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Spinning animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme ? "rgba(34, 40, 49, 0.95)" : "rgba(0, 0, 0, 0.85)" },
        ]}
      >
        <View
          style={[
            styles.contentCard,
            { backgroundColor: theme ? "#393E46" : "#FFFFFF" },
          ]}
        >
          {/* Animated AI Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ rotate: spin }, { scale: pulseValue }],
              },
            ]}
          >
            <View
              style={[
                styles.aiIcon,
                { borderColor: "#00ADB5" },
              ]}
            >
              <Text style={styles.aiIconText}>AI</Text>
            </View>
          </Animated.View>

          {/* Loading Text */}
          <Text
            style={[
              styles.title,
              { color: theme ? "#EEEEEE" : "#222831" },
            ]}
          >
            Evaluating Your Answer
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme ? "#AAAAAA" : "#666666" },
            ]}
          >
            Our AI is carefully analyzing your handwritten answer...
          </Text>

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: "#00ADB5",
                  opacity: pulseValue,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: "#00ADB5",
                  opacity: pulseValue,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: "#00ADB5",
                  opacity: pulseValue,
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.waitText,
              { color: theme ? "#AAAAAA" : "#666666" },
            ]}
          >
            This might take a moment. Sit back and relax!
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contentCard: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  aiIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    backgroundColor: "rgba(0, 173, 181, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiIconText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#00ADB5",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  waitText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default AIEvaluationLoader;
