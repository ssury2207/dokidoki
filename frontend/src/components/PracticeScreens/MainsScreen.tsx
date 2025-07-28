import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import MainsQuestionCard from "../common/MainsQuestionCard";
import AddPhotosComponents from "../common/AddPhotosComponent";
import PrimaryButton from "../atoms/PrimaryButton";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import UserStats from "../common/UserStats";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalText from "../atoms/NormalText";
import { fetchTodaysQuestion } from "@/src/api/dailyMainsQuestion";


const MainsScreen = ({ navigation }) => {
  const [data, setData] = useState<{ id: string } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [buttonActive, setButtonActive] = useState(true);
  const [loading, setLoading] = useState(true);

  const submitHandler = () => {
    navigation.navigate("MainsVerdictOverlay");
    setButtonActive(false);
    setShowAnswer(true);
  };

  useEffect(() => {
    fetchTodaysQuestion()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator />;
  if (!data) return <Text>No question found for today.</Text>;

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title="MAINS QUESTION"
          subtite="Upload your handwritten answer to keep the streak alive!"
        />
        <UserStats />
        <Card>
          <MainsQuestionCard fakeData={data} />

          <AddPhotosComponents />
          {showAnswer ? <NormalText text={"Thank you for writing an answer today"} /> : <></>}
          <PrimaryButton
            isActive={buttonActive}
            submitHandler={submitHandler}
            title="Submit"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default MainsScreen;
