import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import NormalText from "@/components/atoms/NormalText";
import AnswerItem from "./AnswerItem";

type Props = {
  year: string;
  paper: string;
  question: string;
  options: [];
};

const PrelimsQuestionSection: React.FC<Props> = (props) => {
  const [selectedItem, setSelectedItem] = useState();

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
            <AnswerItem key={index} option={item.option} text={item.text} />
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
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
});

export default PrelimsQuestionSection;
