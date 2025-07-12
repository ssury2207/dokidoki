import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import NormalText from "@/src/components/atoms/NormalText";
import AnswerItem from "./AnswerItem";

type Props = {
  year: string;
  paper: string;
  question: string;
  options: [];
};

const PrelimsQuestionSection: React.FC<Props> = (props) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [isSelected, setIsSelected] = useState(false);
  const buttonItemSelector = (index: number) => {
    setSelectedItemIndex(index);
    setIsSelected((isactive) => !isactive);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <NormalText text="Year :" />
        <NormalText text={props.year} />
      </View>

      <View style={styles.row}>
        <NormalText text="Paper :" />
        <NormalText text={props.paper} />
      </View>

      <View style={styles.questionContainer}>
        <NormalText text={props.question} />
      </View>
      {props.options &&
        props.options.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => buttonItemSelector(index)}
              style={[
                styles.section,
                selectedItemIndex === index
                  ? styles.selected
                  : styles.unselected,
              ]}
            >
              <AnswerItem option={item.option} text={item.text} />
            </TouchableOpacity>
          );
        })}
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
  label: {
    fontWeight: "500",
    margin: 2,
  },
  questionContainer: {
    marginVertical: 8,
  },
  questionText: {
    fontWeight: "400",
    fontStyle: "italic",
    fontSize: 16,
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
  incorrect: {
    backgroundColor: "#E8D8D8",
    borderColor: "#FF5A5A",
  },
  unselected: {
    backgroundColor: "#F0F3F6",
    borderColor: "#50555C",
  },
});

export default PrelimsQuestionSection;
