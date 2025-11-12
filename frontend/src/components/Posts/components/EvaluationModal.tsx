import React, { useState } from "react";
import { Modal, View, ScrollView, StyleSheet } from "react-native";
import PrimaryButton from "../../atoms/PrimaryButton";
import DisclaimerText from "../../atoms/DisclaimerText";
import TextLabel from "../../atoms/TextLabel";
import ParameterRow from "./ParameterRow";
import FullScreenLoader from "../../common/FullScreenLoader";
import { supabase } from "@/src/supabaseConfig";
import SecondaryButton from "../../atoms/SecondaryButton";

interface EvaluationModalProps {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  theme: boolean;
  postID: string;
  authorID: string;
  evaluatorID: string;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  visible,
  onClose,
  onRefresh,
  theme,
  postID,
  authorID,
  evaluatorID,
}) => {
  const [param1, setParam1] = useState(5);
  const [param2, setParam2] = useState(5);
  const [param3, setParam3] = useState(5);
  const [param4, setParam4] = useState(5);
  const [param5, setParam5] = useState(5);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const increment = (value: number, setValue: (val: number) => void) => {
    if (value < 10) setValue(value + 1);
  };

  const decrement = (value: number, setValue: (val: number) => void) => {
    if (value > 0) setValue(value - 1);
  };

  const calculateTotal = () => {
    return param1 + param2 + param3 + param4 + param5;
  };

  const submitButtonHandler = async () => {
    const totalPoints = calculateTotal();
    setLoaderVisible(true);
    try {
      const { data, error } = await supabase
        .from("evaluations")
        .insert({
          post_id: postID,
          author_id: authorID,
          evaluator_id: evaluatorID,
          param1: param1,
          param2: param2,
          param3: param3,
          param4: param4,
          param5: param5,
          total_score: totalPoints,
        })
        .select()
        .single();
      if (error) {
        alert("Submission failed backend issue");
        setLoaderVisible(false);
        return;
      }
      alert("Evaluation is submitted");
      onRefresh();
      onClose();
    } catch (error) {
      alert(error);
    } finally {
      setLoaderVisible(false);
    }
  };
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: theme ? "#393E46" : "#FFFFFF" },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            contentContainerStyle={styles.scrollContent}
          >
            <TextLabel text="Evaluate Answer Sheet" />

            <ParameterRow
              label="1. Relevance & Understanding"
              value={param1}
              onIncrement={() => increment(param1, setParam1)}
              onDecrement={() => decrement(param1, setParam1)}
              theme={theme}
            />

            <ParameterRow
              label="2. Structure & Organization"
              value={param2}
              onIncrement={() => increment(param2, setParam2)}
              onDecrement={() => decrement(param2, setParam2)}
              theme={theme}
            />

            <ParameterRow
              label="3. Content Depth & Examples"
              value={param3}
              onIncrement={() => increment(param3, setParam3)}
              onDecrement={() => decrement(param3, setParam3)}
              theme={theme}
            />

            <ParameterRow
              label="4. Presentation & Neatness"
              value={param4}
              onIncrement={() => increment(param4, setParam4)}
              onDecrement={() => decrement(param4, setParam4)}
              theme={theme}
            />

            <ParameterRow
              label="5. Innovation / Value Addition"
              value={param5}
              onIncrement={() => increment(param5, setParam5)}
              onDecrement={() => decrement(param5, setParam5)}
              theme={theme}
            />

            <View style={styles.totalRow}>
              <DisclaimerText text={`Total Score: ${calculateTotal()}/50`} />
            </View>

            <View style={styles.buttonGroup}>
              <View style={styles.buttonWrapper}>
                <PrimaryButton
                  isActive={true}
                  submitHandler={submitButtonHandler}
                  title="Submit"
                />
              </View>
              <View style={styles.buttonWrapper}>
                <SecondaryButton
                  isActive={true}
                  submitHandler={onClose}
                  title="Close"
                />
              </View>
            </View>

            <FullScreenLoader
              visible={loaderVisible}
              message="Submitting...."
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  totalRow: {
    marginVertical: 16,
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 8,
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default EvaluationModal;
