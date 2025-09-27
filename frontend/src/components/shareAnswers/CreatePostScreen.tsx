import React, { useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import FullScreenLoader from "../common/FullScreenLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Title from "../atoms/Title";
import DisclaimerText from "../atoms/DisclaimerText";
import PrimaryButton from "../atoms/PrimaryButton";
import SecondaryButton from "../atoms/SecondaryButton";
import Checkbox from "../atoms/Checkbox";
import { RootStackParamList } from "@/src/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FixedImageCarousel from "../common/FixedImageCarousel";
import NormalText from "../atoms/NormalText";

type CreatePostScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CreatePostScreen"
>;

const CreatePostScreen = ({ navigation, route }: CreatePostScreenProps) => {
  const [loading, setLoading] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [newComment, setNewComment] = useState("");

  const images = route.params?.images || [];

  // Mock data for now - in real app this would come from props/API
  const postData = {
    username: "subhash", // This should come from route params or API
    isAnonymous: true, // Changed to true to test anonymous display
    date: "26/09/2024", // This should be formatted from createdAt
    question:
      "Discuss the impact of climate change on global food security and suggest possible solutions.", // From route params
    comments: [], // This should come from API
  };

  const handleImagePress = (imageUrl: string) => {
    navigation.navigate("FullScreenImageViewer", { imageUrl });
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
      >
        <Card>
          <NormalText
            text={
              postData.isAnonymous
                ? `anonymous | ${postData.date}`
                : `${postData.username} | ${postData.date}`
            }
          />
          {showQuestion && <DisclaimerText text={postData.question} />}

          <TouchableOpacity
            style={{ marginVertical: 8 }}
            onPress={() => setShowQuestion(!showQuestion)}
          >
            <DisclaimerText
              text={showQuestion ? "Hide Question" : "Show Question"}
            />
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.carouselContainer}>
              <FixedImageCarousel
                images={images}
                onImagePress={handleImagePress}
              />
            </View>
          )}
        </Card>
      </ScrollView>
      <FullScreenLoader visible={loaderVisible || loading} />
    </SafeAreaView>
  );
};

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
  headerContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  carouselContainer: {
    marginBottom: 16,
  },
  noCommentsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  commentInputContainer: {
    marginTop: 16,
  },
  commentInput: {
    borderColor: "#CCCC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  fileItem: {
    borderColor: "#FFC618",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
  },
  fileText: {
    color: "#37B9C5",
    fontWeight: "700",
    fontStyle: "italic",
  },
  inputStyle: {
    borderColor: "#CCCC",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  inputColorLight: {
    color: "#50555C",
  },
  inputColorDark: {
    color: "#CCCC",
  },
});

export default CreatePostScreen;
