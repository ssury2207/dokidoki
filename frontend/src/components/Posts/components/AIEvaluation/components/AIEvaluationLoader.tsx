import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Title from "@/src/components/atoms/Title";
import DisclaimerText from "@/src/components/atoms/DisclaimerText";

interface AIEvaluationLoaderProps {
  visible: boolean;
}

const AIEvaluationLoader: React.FC<AIEvaluationLoaderProps> = ({ visible }) => {
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  // Array of messages to show during loading
  const loadingMessages = [
    "Processing your answer images...",
    "Reading your handwriting...",
    "Analyzing content quality...",
    "Evaluating answer structure...",
    "Finalizing evaluation report...",
  ];

  // Get current stage index based on elapsed time
  const getCurrentStage = () => {
    if (elapsedSeconds < 3) return 0;
    if (elapsedSeconds < 7) return 1;
    if (elapsedSeconds < 12) return 2;
    if (elapsedSeconds < 17) return 3;
    return 4;
  };

  const currentStage = getCurrentStage();

  useEffect(() => {
    if (visible) {
      // Timer - increment every second
      const timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        setElapsedSeconds(0); // Reset on unmount
      };
    }
  }, [visible]);

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
          {
            backgroundColor: theme
              ? "rgba(34, 40, 49, 0.95)"
              : "rgba(0, 0, 0, 0.85)",
          },
        ]}
      >
        <View
          style={[
            styles.contentCard,
            { backgroundColor: theme ? "#393E46" : "#FFFFFF" },
          ]}
        >
          {/* Title Header */}
          <Title title="Evaluating Your Answer" />

          {/* Vertical Timeline */}
          <View style={styles.timelineContainer}>
            {loadingMessages.map((message, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.iconColumn}>
                  <Text style={styles.stageIcon}>
                    {index < currentStage
                      ? "✓"
                      : index === currentStage
                      ? "⚡"
                      : "○"}
                  </Text>
                </View>
                <View style={styles.messageColumn}>
                  <Text
                    style={[
                      styles.stageMessage,
                      {
                        color:
                          index === currentStage
                            ? "#00ADB5"
                            : index < currentStage
                            ? theme
                              ? "#AAAAAA"
                              : "#666666"
                            : theme
                            ? "#555555"
                            : "#CCCCCC",
                        fontWeight: index === currentStage ? "600" : "400",
                      },
                    ]}
                  >
                    {message}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Timer Footer */}
          <View style={styles.timerFooter}>
            <DisclaimerText text={`⏳ ${elapsedSeconds} s`} />
          </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  timelineContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconColumn: {
    width: 32,
    alignItems: "center",
    marginRight: 12,
  },
  stageIcon: {
    fontSize: 20,
  },
  messageColumn: {
    flex: 1,
  },
  stageMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  timerFooter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});

export default AIEvaluationLoader;
