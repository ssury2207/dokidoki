import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import TitleAndSubtitleCard from "../common/TitleAndSubtitleCard";
import UserStats from "../common/UserStats";
import Card from "../atoms/Card";
import NormalText from "../atoms/NormalText";
import Table from "../atoms/Table";
import AnswerItem from "../PracticeScreens/components/AnswerItem";
import PrimaryButton from "../atoms/PrimaryButton";
import ExpectedArchievedPrelimsAnswer from "../archivedScreens/ExpectedArchievedPrelimsAnswer";
import FullScreenLoader from "../common/FullScreenLoader";
import { supabase } from "@/src/supabaseConfig";

export default function PrelimsPyqPractice({ route }: any) {
  const { question } = route.params;

  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Parse table_name same as fetchArchiveQuestions.ts
  let tableData = question.table_name;
  if (typeof tableData === 'string' && tableData.trim()) {
    try {
      // Replace Python-style single quotes with double quotes for valid JSON
      const jsonString = tableData.replace(/'/g, '"');
      tableData = JSON.parse(jsonString);
    } catch (e) {
      console.log('Failed to parse table_name:', e);
      tableData = null;
    }
  }

  useEffect(() => {
    const checkIfSolved = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_pyq_solved')
          .select('selected_option, verdict')
          .eq('user_id', user.id)
          .eq('question_id', question.id)
          .single();

        if (data) {
          setSelectedOption(data.selected_option);
          setVerdict(data.verdict === 'correct' ? 'Correct' : 'Incorrect');
          setShowAnswer(true);
          setIsLocked(true);
        }
      } catch (error) {
        console.log('Check solved error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkIfSolved();
  }, []);

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert("Please select an option");
      return;
    }

    if (!question.answer) {
      alert("Answer not available");
      return;
    }

    const expectedOptionIndex =
      question.answer.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
    const isCorrect = selectedOption === expectedOptionIndex;

    setVerdict(isCorrect ? "Correct" : "Incorrect");
    setShowAnswer(true);
    setIsLocked(true);
    setLoaderVisible(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login first");
        setLoaderVisible(false);
        return;
      }

      const { error } = await supabase
        .from('user_pyq_solved')
        .insert({
          user_id: user.id,
          question_id: question.id,
          selected_option: selectedOption,
          verdict: isCorrect ? 'correct' : 'incorrect',
        });

      if (error) {
        console.error('Submission error:', error);
        alert('Failed to submit answer');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit answer');
    } finally {
      setLoaderVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        theme
          ? [styles.bodyBGDark, styles.body]
          : [styles.bodyBGLight, styles.body],
      ]}
    >
      <ScrollView
        style={[
          styles.scroll,
          theme
            ? { backgroundColor: "#222831" }
            : { backgroundColor: "#F5F5F5" },
        ]}
        contentContainerStyle={{
          paddingTop: 16,
        }}
      >
        <TitleAndSubtitleCard
          title="PRELIMS PYQs"
          subtite="Select one correct option to keep your memory sharp !!"
        />
        <UserStats />
        <Card>
          <View style={styles.row}>
            <NormalText text="Year :" />
            <NormalText text={String(question.year)} />
          </View>
          <View style={styles.questionContainer}>
            <NormalText text={question.question_and_year} />
          </View>
          <View style={styles.questionContainer}>
            <Table table={tableData} />
          </View>
          {question.options &&
            Array.isArray(question.options) &&
            question.options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                disabled={isLocked}
                onPress={() => setSelectedOption(index)}
                style={[
                  styles.section,
                  selectedOption === index
                    ? theme
                      ? styles.selectedDark
                      : styles.selected
                    : theme
                    ? styles.unselectedDark
                    : styles.unselected,
                  isLocked && { opacity: 0.6 },
                ]}
              >
                <AnswerItem text={option} />
              </TouchableOpacity>
            ))}
          <PrimaryButton
            isActive={!isLocked}
            submitHandler={handleSubmit}
            title="Submit"
          />
          {showAnswer && selectedOption !== null && (
            <ExpectedArchievedPrelimsAnswer
              actualOption={question.options[selectedOption]}
              expectedOption={question.answer}
              explainatation={question.explanation}
              verdict={verdict}
            />
          )}
        </Card>
      </ScrollView>
      <FullScreenLoader visible={loaderVisible || loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  bodyBGDark: {
    backgroundColor: "#222831",
  },
  bodyBGLight: {
    backgroundColor: "#F5F5F5",
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
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
