import { StyleSheet, ScrollView, View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import UserStats from "../common/UserStats";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import Data from "../../fakeData/data";
import ExpectedPrelimsAnswer from "./components/ExpectedPrelimsAnswer";
import PrelimsQuestionSection from "./components/PrelimsQuestionSection";
export default function PrelimsScreen() {
  const [buttonActive, setButtonActive] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(Data[0][0]);
  }, []);
  const submitHandler = () => {
    setButtonActive(false);
    setShowAnswer(true);
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title="PRELIMS QUESTION"
          subtite="Select one correct option to keep streak alive and earn points!"
        />

        <UserStats streak="5" points="100" />
        <Card>
          <PrelimsQuestionSection
            year={data.year}
            paper={data.paper}
            question={data.question}
            options={data.options}
          />
          <PrimaryButton
            isActive={true}
            submitHandler={submitHandler}
            title="Submit"
          />
          {showAnswer ? (
            <ExpectedPrelimsAnswer
              actualOption=""
              expectedOption={data.correctOption}
              expectedAnswer={data.answer}
            />
          ) : (
            <></>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#F0F3F6",
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
});
