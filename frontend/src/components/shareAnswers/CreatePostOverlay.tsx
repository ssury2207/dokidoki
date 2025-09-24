import { View } from "react-native";
import Title from "../atoms/Title";
import NormalText from "../atoms/NormalText";
import PrimaryButton from "../atoms/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import SecondaryButton from "../atoms/SecondaryButton";
const CreatePostOverlay = () => {
  const navigation = useNavigation();
  const streak = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  const shareButtonHandler = () => {
    navigation.navigate("CreatePostScreen");
  };
  return (
    <View style={styles.overlay}>
      <View
        style={[styles.modal, theme ? styles.modalBGDark : styles.modalBGLight]}
      >
        <Title title="Submission successfull!!" />

        <View style={styles.row}>
          <NormalText text="+5 points added to your score" />
        </View>
        <View style={styles.row}>
          <NormalText text="Share your answer with peers for feedback and reviews. You can also post anonymously." />
        </View>

        <View style={styles.row}></View>

        <PrimaryButton
          isActive={true}
          submitHandler={shareButtonHandler}
          title="Share"
        />
        <SecondaryButton
          isActive={true}
          submitHandler={overlayButtonHandler}
          title="Not Now"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalBGLight: {
    backgroundColor: "white",
  },
  modalBGDark: {
    backgroundColor: "#222831",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreatePostOverlay;
