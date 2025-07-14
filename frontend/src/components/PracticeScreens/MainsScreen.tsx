import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import MainsQuestionCard from "../common/MainsQuestionCard";
import AddPhotosComponents from "../common/AddPhotosComponent";
import PrimaryButton from "../atoms/PrimaryButton";
import Data from "../../../fakeData/data";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import UserStats from "../common/UserStats";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import NormalText from "../atoms/NormalText";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const MainsScreen = ({ navigation }) => {
  const [data, setData] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [buttonActive, setButtonActive] = useState(true);

  useEffect(() => {
    Data[1].map((data) => setData(data));
  }, [data]);

  const submitHandler = () => {
    navigation.navigate("MainsVerdictOverlay");
    setButtonActive(false);
    setShowAnswer(true);
  };

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
          {showAnswer ? <NormalText text={data.answer} /> : <></>}
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
