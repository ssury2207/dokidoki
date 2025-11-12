import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "@/src/types/navigation";
import FullScreenLoader from "../common/FullScreenLoader";

import { supabase } from "@/src/supabaseConfig";
import PrimaryButton from "../atoms/PrimaryButton";
import DisclaimerText from "../atoms/DisclaimerText";
import TextLabel from "../atoms/TextLabel";
import Subtitle from "../atoms/Subtitle";
import NormalText from "../atoms/NormalText";
type Nav = StackNavigationProp<RootStackParamList, "PrelimsPyqScreen">;
type QuestionData = {
  id: string;
  section: string;
  question_and_year: string;
  year: number;
  answer: string;
  explanation: string;
  options: string;
  table_name: string;
};
export default function PrelimsPyqScreen() {
  const navigation = useNavigation<Nav>();
  const isLight = useSelector((s: RootState) => s.theme.isLight);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionData, setQuestionData] = useState<QuestionData[] | null>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [section, setSection] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [showSectionModal, setShowSectionModal] = useState<boolean>(false);

  const limit = 10;

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from("dataset_prelims_questions")
          .select("section");

        if (error) {
          console.error("Error fetching sections:", error);
          return;
        }

        const uniqueSections = [
          ...new Set(data?.map((item) => item.section) || []),
        ];
        setSection(uniqueSections);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
          .from("dataset_prelims_questions")
          .select(
            "id, section , question_and_year, year, answer, explanation, options, table_name",
            { count: "exact" }
          );

        if (selectedSection !== "All") {
          query = query.eq("section", selectedSection);
        }

        const { data, error, count } = await query.range(from, to);

        if (error) {
          alert("There seems to be an issue on Backend");
        }
        console.log("data is fetched");
        if (count) setTotalPage(Math.ceil(count / limit));

        setQuestionData(data);
      } catch (error) {
        alert(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [page, selectedSection]);
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
  const questionButtonHandler = (item: QuestionData) => {
    navigation.navigate("PrelimsPyqPractice", {
      question: {
        id: item.id,
        question_and_year: item.question_and_year,
        year: item.year,
        options: item.options,
        table_name: item.table_name,
        answer: item.answer,
        explanation: item.explanation,
      },
    });
  };

  const containerStyle = [
    styles.container,
    isLight ? styles.containerDark : styles.containerLight,
  ];

  const cardStyle = [styles.card, isLight ? styles.cardDark : styles.cardLight];

  const questionTextStyle = [
    styles.questionText,
    isLight ? styles.questionTextDark : styles.questionTextLight,
  ];

  const renderQuestionItem = ({ item }: { item: QuestionData }) => (
    <TouchableOpacity
      style={cardStyle}
      activeOpacity={0.8}
      onPress={() => questionButtonHandler(item)}
    >
      <Text numberOfLines={2} ellipsizeMode="tail" style={questionTextStyle}>
        {item.question_and_year}
      </Text>
      <DisclaimerText text={`Year: ${item.year}`} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={containerStyle}>
      <Modal
        visible={showSectionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSectionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSectionModal(false)}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: isLight ? "#393E46" : "#FFFFFF" },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <FlatList
              data={["All", ...section]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedSection(item);
                    setPage(1);
                    setShowSectionModal(false);
                  }}
                >
                  <NormalText text={item} />
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.contentWrapper}>
        <View style={styles.filterContainer}>
          <View style={styles.filterItem}>
            <TextLabel text="Section: " />
            <TouchableOpacity
              style={[
                styles.dropdown,
                { backgroundColor: !isLight ? "#FFF" : "#393E46" },
              ]}
              onPress={() => setShowSectionModal(true)}
            >
              <DisclaimerText text={selectedSection} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listWrapper}>
          <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.listContent}
            renderItem={renderQuestionItem}
            data={questionData}
          />
        </View>
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
        <DisclaimerText text="*We will be updating new sections like polity, geography in upcoming weeeks.." />

        <FullScreenLoader visible={loading} message="Loading PYQs..." />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  containerLight: {
    backgroundColor: "#F5F5F5",
  },
  containerDark: {
    backgroundColor: "#222831",
  },
  contentWrapper: {
    flex: 1,
  },
  filterContainer: {
    width: "100%",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  listWrapper: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 20,
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
  card: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
  },
  cardDark: {
    backgroundColor: "#393E46",
    shadowColor: "#FFFFFF",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  questionTextLight: {
    color: "#000",
  },
  questionTextDark: {
    color: "#EEE",
  },
  yearText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "60%",
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
