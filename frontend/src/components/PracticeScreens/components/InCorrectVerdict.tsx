import { View } from "react-native";
import Title from "../../atoms/Title";
import NormalText from "../../atoms/NormalText";
import PrimaryButton from "../../atoms/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
// import RedCrossIcon from "../../atoms/RedCrossIcon";

const InCorrectVerdict = () => {
  const navigation = useNavigation();

  const overlayButtonHandler = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.modal}>
      <Title title="Opps !!" />

      <View style={styles.row}>
        {/* <RedCrossIcon /> */}
        <NormalText text="Your answer was incorrect" />
      </View>
      <View style={styles.row}>
        {/* <RedCrossIcon /> */}
        <NormalText text="Try again tomorrow to gain Points" />
      </View>

      <View style={styles.row}>
        <NormalText text={`Current Streak ${2} Days `} />
      </View>
      <PrimaryButton
        isActive={true}
        submitHandler={overlayButtonHandler}
        title="Review Detailed Answer"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default InCorrectVerdict;
