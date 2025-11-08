import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import QuestionCard from "./Components/QuestionCard";
import { FlatList } from "react-native";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import PrimaryButton from "../atoms/PrimaryButton";
import TextLabel from "../atoms/TextLabel";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/types/navigation";
import { supabase } from "@/src/supabaseConfig";
import FullScreenLoader from "../common/FullScreenLoader";
import DisclaimerText from "../atoms/DisclaimerText";
type renderItemProps = {
  id?: string;
  questionId?: string;
  Question: string;
  Year?: number;
  Paper?: string;
  Marks?: number;
  date: string;
  questionData?: [] | null;
};

type Props = NativeStackScreenProps<RootStackParamList, "PractisedQuestions">;

export default function PractisedQuestionsScreen({ route, navigation }: Props) {
  const params = route.params ?? {};
  const [data, setData] = useState<[]>([]);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const questionType = (params as any).questionType ?? "mains";
  const today = new Date().toISOString().substring(0, 10);
  const [totalPage, setTotalPage] = useState(1);
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const limit = 10;
  const [page, setPage] = useState(1);
  useEffect(() => {
    const getData = async () => {
      setLoaderVisible(true);

      try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const isPrelims = questionType === "prelims";
        let query = supabase
          .from(
            isPrelims == true
              ? "daily_prelims_questions"
              : "daily_mains_questions"
          )
          .select("*", { count: "exact" })
          .neq("date", today)
          .order("date", { ascending: false })
          .range(from, to);
        const { data, error, count } = await query;
        if (error) {
          alert("There seems to be an issue on Backend, in fetching question");
        }
        if (count) setTotalPage(Math.ceil(count / limit));
        setData(data);
      } catch (error) {
        setLoaderVisible(false);
        alert(error);
      } finally {
        setLoaderVisible(false);
      }
    };
    getData();
  }, [page]);
  const handlePreviousButton = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleNextButton = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };
  const renderItem = ({ item }: { item: renderItemProps }) => (
    <QuestionCard
      question={item.question}
      year={item.year ?? 0}
      paper={item.paper ?? null}
      marks={item.marks ?? null}
      date={item.date}
      questionData={item}
      questionType={questionType}
    />
  );

  return (
    <View style={[styles.body, theme ? styles.bodyBGDark : styles.bodyBGLight]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.questionId || item.id || item.date || `question-${index}`
        }
        ListHeaderComponent={
          <TitleAndSubtitleCard
            title={"MISSED QUESTIONS"}
            subtite={
              "Catch up on questions you skipped in your daily challenges"
            }
          />
        }
        ListEmptyComponent={
          <View style={styles.noQuestionCard}>
            <TextLabel text="No Questions Here" />
            <PrimaryButton
              submitHandler={() => navigation.navigate("Dashboard")}
              isActive={true}
              title="Dashboard"
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <View style={styles.paginationContainer}>
        <View style={styles.paginationButton}>
          <PrimaryButton
            title="Prev"
            submitHandler={handlePreviousButton}
            isActive={page !== 1}
          />
        </View>
        <DisclaimerText text={`${page} / ${totalPage}`} />
        <View style={styles.paginationButton}>
          <PrimaryButton
            title="Next"
            submitHandler={handleNextButton}
            isActive={page !== totalPage}
          />
        </View>
      </View>

      <FullScreenLoader visible={loaderVisible} message="Loading..." />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingBottom: 40,
  },
  bodyBGDark: {
    backgroundColor: "#222831",
  },
  bodyBGLight: {
    backgroundColor: "#F5F5F5",
  },
  noQuestionCard: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  paginationButton: {
    flex: 1,
    margin: 4,
  },
});
