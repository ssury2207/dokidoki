import React, { useEffect } from "react";
import { StyleSheet, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import Card from "../atoms/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import FullScreenLoader from "../common/FullScreenLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Title from "../atoms/Title";
import DisclaimerText from "../atoms/DisclaimerText";
const CreatePostScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const [loaderVisible, setLoaderVisible] = useState(false);

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
        <Title title="Create Post" />

        <Card>
          <TextInput
            placeholder="Title"
            multiline={true}
            maxLength={150}
            placeholderTextColor={!theme ? "#393E46" : "#CCCCCC"}
            style={[
              styles.inputStyle,
              theme ? styles.inputColorDark : styles.inputColorLight,
            ]}
          />
          <DisclaimerText text="*max 150 chars" />
          <TextInput
            placeholder="Add More Details..."
            multiline={true}
            maxLength={200}
            placeholderTextColor={!theme ? "#393E46" : "#CCCCCC"}
            style={theme ? styles.inputColorDark : styles.inputColorLight}
          />
          <DisclaimerText text="*max 200 chars" />
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
  },
  inputColorLight: {
    color: "#50555C",
  },
  inputColorDark: {
    color: "#CCCC",
  },
});

export default CreatePostScreen;
