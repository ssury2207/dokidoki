import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import NormalText from "@/src/components/atoms/NormalText";
import Table from "../atoms/Table";
import AnswerItem from "../PracticeScreens/components/AnswerItem";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ShareButton from "../common/ShareButton";
const PrelimsArchivedQuestionSection = ({
  isLocked,
  initialSelection,
  data,
  onSelectOption,
}: {
  isLocked: boolean;
  initialSelection: number | null;
  data: any;
  onSelectOption: (idx: number) => void;
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    initialSelection
  );
  const theme = useSelector((state: RootState) => state.theme.isLight);

  useEffect(() => {
    if (typeof initialSelection === "number") {
      setSelectedItemIndex(initialSelection);
    }
  }, [initialSelection]);

  const handleOptionSelect = (index: number) => {
    if (isLocked) return;
    setSelectedItemIndex(index);
    onSelectOption(index); // to lift state up if needed later
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <NormalText text="Year :" />
        <NormalText text={data.year} />
      </View>

      <View style={styles.questionContainer}>
        <NormalText text={data.question} />
      </View>
      <View style={styles.questionContainer}>
        <Table table={data.table_name} />
      </View>
      {data.options?.map((item: string, index: number) => (
        <TouchableOpacity
          key={index}
          disabled={isLocked}
          onPress={() => handleOptionSelect(index)}
          style={[
            styles.section,
            selectedItemIndex === index
              ? theme
                ? styles.selectedDark
                : styles.selected
              : theme
              ? styles.unselectedDark
              : styles.unselected,
            isLocked && { opacity: 0.6 },
          ]}
        >
          <AnswerItem text={item} />
        </TouchableOpacity>
      ))}
      <ShareButton question={data.question} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  questionContainer: {
    marginVertical: 8,
  },
  section: {
    borderRadius: 10,
    borderWidth: 1,
    margin: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  selected: {
    backgroundColor: "#CBDFE1",
    borderColor: "#37B9C5",
  },
  selectedDark: {
    backgroundColor: "#393E46",
    borderColor: "#37B9C5",
  },
  unselected: {
    backgroundColor: "#F0F3F6",
    borderColor: "#50555C",
  },
  unselectedDark: {
    backgroundColor: "#393E46",
    borderColor: "#50555C",
  },
});

export default PrelimsArchivedQuestionSection;
